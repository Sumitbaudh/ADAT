import mongoose from "mongoose";

export const TenderSchema = new mongoose.Schema({
  title: String,
  referenceNo: { type: String, index: true },
  closingDate: String,
  bidOpeningDate: String,
  link: String
}, { timestamps: true });


export const CorrigendumSchema = new mongoose.Schema({
    title: String,
    referenceNo: { type: String, index: true },
    closingDate: String,
    bidOpeningDate: String,
    link: String
  }, { timestamps: true });
