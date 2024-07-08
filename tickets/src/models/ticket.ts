import mongoose, { mongo } from "mongoose";

interface TicketAttrs {
    title: string,
    price: number,
    userId: string
}

//  Properties that TS allowed to access
interface TicketDoc extends mongoose.Document{
    title: string,
    price: number,
    userId: string
}


// adding custom method to the MongoDB schema
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
}, {
    toJSON : {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        } 
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};

