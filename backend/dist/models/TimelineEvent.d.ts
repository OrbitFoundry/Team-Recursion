import mongoose, { Document } from 'mongoose';
export interface ITimelineEvent extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const TimelineEvent: mongoose.Model<ITimelineEvent, {}, {}, {}, mongoose.Document<unknown, {}, ITimelineEvent, {}, {}> & ITimelineEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TimelineEvent;
//# sourceMappingURL=TimelineEvent.d.ts.map