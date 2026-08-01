import mongoose, { Document, Types } from 'mongoose';
export interface ICompany extends Document {
    userId: Types.ObjectId;
    companyName: string;
    role: string;
    applicationDate: Date;
    status: 'Applied' | 'Online Assessment' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';
    companyLink?: string;
    techStacks?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}, {}> & ICompany & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Company.d.ts.map