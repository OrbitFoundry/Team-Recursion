const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({ email: String }));
  const ayush = await User.findOne({ email: 'ayush@student.dev' });
  if (!ayush) {
    console.log('User not found');
    return mongoose.disconnect();
  }
  const Company = mongoose.model('Company', new mongoose.Schema({ companyName: String, userId: mongoose.Schema.Types.ObjectId, techStacks: [String] }));
  
  const stacks = ['React', 'Node.js', 'Express', 'MongoDB'];
  
  await Company.updateMany(
    { userId: ayush._id, companyName: { $in: ['Google', 'Wipro', 'Flipkart'] } },
    { $set: { techStacks: stacks } }
  );
  console.log('Successfully seeded tech stacks for Ayush');
  mongoose.disconnect();
}).catch(console.error);
