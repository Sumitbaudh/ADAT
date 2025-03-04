import mongoose from "mongoose";
export const TenderSchema = new mongoose.Schema(
  {
    title: String,
    referenceNo: String,
    closingDate: String,
    bidOpeningDate: String,
    link: String,
    organisationChain: String,
    tenderReferenceNumber: String,
    tenderID: { type: String, unique: true },
    withdrawalAllowed: String,
    tenderType: String,
    formOfContract: String,
    tenderCategory: String,
    numberOfCovers: String,
    generalTechnicalEvaluationAllowed: String,
    itemWiseTechnicalEvaluationAllowed: String,
    paymentMode: String,
    isMultiCurrencyAllowedForBOQ: String,
    isMultiCurrencyAllowedForFee: String,
    allowTwoStageBidding: String,
  },
  { timestamps: true }
);


export const CorrigendumSchema =new mongoose.Schema(
  {
    title: String,
    referenceNo: String,
    closingDate: String,
    bidOpeningDate: String,
    link: String,
    organisationChain: String,
    tenderReferenceNumber: String,
    tenderID: { type: String, unique: true },
    withdrawalAllowed: String,
    tenderType: String,
    formOfContract: String,
    tenderCategory: String,
    numberOfCovers: String,
    generalTechnicalEvaluationAllowed: String,
    itemWiseTechnicalEvaluationAllowed: String,
    paymentMode: String,
    isMultiCurrencyAllowedForBOQ: String,
    isMultiCurrencyAllowedForFee: String,
    allowTwoStageBidding: String,
  },
  { timestamps: true }
);

