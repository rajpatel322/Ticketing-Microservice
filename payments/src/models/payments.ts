import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttrs {
    orderId: string;
    stripId: string;
}


interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripId: string;
    version: number;
};


interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
};

const paymentSchema = new mongoose.Schema({
    orderId: {
        required: true,
        type: String
    },
    stripId: {
        required: true,
        type: String
    },
}, {
    toJSON: {
        transform(doc, ret) { // remove the _id property and create a new property called id
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export {Payment};