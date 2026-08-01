import mongoose, { Document, Types } from 'mongoose';
export interface IResource extends Document {
    userId: Types.ObjectId;
    title: string;
    category: 'DSA' | 'Aptitude' | 'Resume' | 'Interview Experience' | 'Core Subjects';
    link: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Resource.d.ts.map