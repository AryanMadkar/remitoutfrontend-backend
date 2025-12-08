// models/CoBorrower.js
import mongoose from "mongoose";

const CoBorrowerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Co-borrower sequence (1 or 2)
    sequence: {
      type: Number,
      required: true,
      enum: [1, 2],
    },

    // Processing status
    processingStatus: {
      type: String,
      enum: ["processing", "completed", "failed", "partial"],
      default: "processing",
    },

    processingJobId: String,
    processingError: String,
    processingTime: Number,

    // Personal Info
    personalInfo: {
      employeeId: String,
      companyName: String,
      designation: String,
      name: String,
    },

    // Salary Slips (3 months)
    salarySlips: [
      {
        month: String,
        year: String,
        grossSalary: Number,
        netSalary: Number,
        basicSalary: Number,
        hra: Number,
        allowances: Number,
        deductions: {
          pf: Number,
          tax: Number,
          insurance: Number,
          other: Number,
        },
        employerName: String,
        documentUrl: String,
        cloudinaryPublicId: String,
      },
    ],

    // Bank Statement
    bankStatement: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      accountType: String,
      statementPeriod: {
        from: String,
        to: String,
      },
      monthlyData: [
        {
          month: String,
          year: String,
          openingBalance: Number,
          closingBalance: Number,
          totalCredits: Number,
          totalDebits: Number,
          salaryCredit: Number,
          emiPayments: Number,
          minBalance: Number,
          bounces: Number,
        },
      ],
      averageMonthlyBalance: Number,
      totalEmiObserved: Number,
      salaryConsistency: String, // "stable", "variable", "irregular"
      documentUrl: String,
      cloudinaryPublicId: String,
      pageCount: Number,
    },

    // ITR Data (3 years)
    itrData: [
      {
        assessmentYear: String,
        financialYear: String,
        totalIncome: Number,
        taxPaid: Number,
        filingDate: String,
        incomeFromSalary: Number,
        incomeFromBusiness: Number,
        incomeFromOtherSources: Number,
        acknowledged: Boolean,
        acknowledgmentNumber: String,
        documentUrl: String,
        cloudinaryPublicId: String,
      },
    ],

    // Form 16 (optional)
    form16Data: {
      financialYear: String,
      employerName: String,
      grossSalary: Number,
      standardDeduction: Number,
      taxableIncome: Number,
      tdsDeducted: Number,
      panNumber: String,
      documentUrl: String,
      cloudinaryPublicId: String,
      extractionConfidence: Number,
    },

    // Business Proof (if applicable)
    businessProof: {
      businessName: String,
      gstNumber: String,
      registrationNumber: String,
      annualRevenue: Number,
      annualProfit: Number,
      businessType: String,
      documentUrls: [String],
    },

    // Financial Summary (from Python server verification)
    financialSummary: {
      averageMonthlyIncome: Number,
      totalAnnualIncome: Number,
      debtToIncomeRatio: Number,
      creditworthiness: String, // "excellent", "good", "fair", "poor"
      recommendedLoanAmount: Number,
      riskLevel: String, // "low", "medium", "high"
      verifiedAt: Date,
    },

    // All uploaded documents metadata
    allDocuments: [
      {
        documentType: String, // "salaryslip", "itr", "form16", "bankstatement"
        documentUrl: String,
        cloudinaryPublicId: String,
        uploadedAt: Date,
        pageCount: Number,
        fileSize: Number,
        originalFilename: String,
      },
    ],

    lastProcessedAt: Date,
  },
  { timestamps: true }
);

// Compound index to ensure max 2 co-borrowers per student
CoBorrowerSchema.index({ student: 1, sequence: 1 }, { unique: true });
CoBorrowerSchema.index({ processingStatus: 1 });

export default mongoose.models.CoBorrower ||
  mongoose.model("CoBorrower", CoBorrowerSchema);
