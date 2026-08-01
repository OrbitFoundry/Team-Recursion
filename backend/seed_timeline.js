const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({ email: String }));
  const ayush = await User.findOne({ email: 'ayush@student.dev' });
  if (!ayush) {
    console.log('User not found');
    return mongoose.disconnect();
  }

  const timelineEventSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    date: Date,
  }, { timestamps: true });

  const TimelineEvent = mongoose.models.TimelineEvent || mongoose.model('TimelineEvent', timelineEventSchema);
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const events = [
    {
      userId: ayush._id,
      title: 'Google Online Assessment',
      description: '90 minutes coding test. Topics: Trees, Graphs, DP.',
      date: tomorrow,
    },
    {
      userId: ayush._id,
      title: 'Wipro HR Round',
      description: 'Discussing resume and cultural fit.',
      date: yesterday,
    },
    {
      userId: ayush._id,
      title: 'Flipkart Technical Interview',
      description: 'System design round focusing on scalable architectures.',
      date: nextWeek,
    }
  ];
  
  await TimelineEvent.insertMany(events);
  console.log('Successfully seeded timeline events for Ayush');
  mongoose.disconnect();
}).catch(console.error);
