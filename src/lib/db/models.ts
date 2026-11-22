import mongoose, { Schema, model, type Model } from "mongoose";

const { models: M } = mongoose;

const GeoPoint = new Schema(
  { lat: Number, lng: Number },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    address: { type: String, required: true },
    area: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, default: "Tamil Nadu" },
    pincode: { type: String, required: true, index: true },
    coordinates: GeoPoint,
  },
  { _id: false },
);

const SpecificationsSchema = new Schema(
  {
    plotArea: Number,
    builtUpArea: Number,
    carpetArea: Number,
    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    facing: String,
    roadWidth: Number,
    floors: Number,
    floorNumber: Number,
    totalFloors: Number,
    parking: Number,
    age: Number,
    waterSource: String,
    powerBackup: Boolean,
  },
  { _id: false },
);

const PropertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    listingType: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    priceUnit: { type: String, default: "total" },
    maintenancePerMonth: Number,
    location: { type: LocationSchema, required: true },
    specifications: { type: SpecificationsSchema, default: {} },
    amenities: { type: [String], default: [] },
    nearby: {
      type: [
        new Schema(
          { type: String, name: String, distanceKm: Number },
          { _id: false },
        ),
      ],
      default: [],
    },
    images: {
      type: [
        new Schema(
          { url: String, alt: String, width: Number, height: Number, isCover: Boolean },
          { _id: false },
        ),
      ],
      default: [],
    },
    videoUrl: String,
    tourUrl: String,
    floorPlanUrl: String,
    documents: {
      type: [
        new Schema(
          { label: String, url: String, verified: { type: Boolean, default: false } },
          { _id: false },
        ),
      ],
      default: [],
    },
    approvalNotes: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedAgent: { type: Schema.Types.ObjectId, ref: "User" },
    approvalStatus: { type: String, default: "pending", index: true },
    availabilityStatus: { type: String, default: "available", index: true },
    verified: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    isDemo: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
);

PropertySchema.index({ "location.city": 1, category: 1, price: 1 });
PropertySchema.index({ title: "text", description: "text", "location.area": "text" });

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["super_admin", "admin", "agent", "owner", "customer"],
      default: "customer",
      index: true,
    },
    avatar: String,
    preferences: {
      locations: [String],
      categories: [String],
      budgetMin: Number,
      budgetMax: Number,
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    otp: { code: String, expiresAt: Date },
    resetToken: { token: String, expiresAt: Date },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: String,
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    budget: Number,
    locationPreference: String,
    requirements: String,
    source: { type: String, required: true, index: true },
    assignedAgent: { type: Schema.Types.ObjectId, ref: "User", index: true },
    status: { type: String, default: "new", index: true },
    priority: { type: String, default: "medium" },
    followUpDate: Date,
    notes: {
      type: [
        new Schema(
          { author: String, text: String, createdAt: { type: Date, default: Date.now } },
          { _id: false },
        ),
      ],
      default: [],
    },
    dedupeKey: { type: String, index: true },
  },
  { timestamps: true },
);

LeadSchema.index({ status: 1, assignedAgent: 1 });

const SiteVisitSchema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    contactPreference: { type: String, default: "call" },
    notes: String,
    status: { type: String, default: "requested", index: true },
  },
  { timestamps: true },
);

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
  },
  { timestamps: true },
);
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const ReviewSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: String,
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
    approvalStatus: { type: String, default: "pending", index: true },
  },
  { timestamps: true },
);

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: String,
    message: String,
    href: String,
    readStatus: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

const SettingsSchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    value: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const PropertyModel: Model<any> = M.Property || model("Property", PropertySchema);
export const UserModel: Model<any> = M.User || model("User", UserSchema);
export const LeadModel: Model<any> = M.Lead || model("Lead", LeadSchema);
export const SiteVisitModel: Model<any> = M.SiteVisit || model("SiteVisit", SiteVisitSchema);
export const FavoriteModel: Model<any> = M.Favorite || model("Favorite", FavoriteSchema);
export const ReviewModel: Model<any> = M.Review || model("Review", ReviewSchema);
export const NotificationModel: Model<any> =
  M.Notification || model("Notification", NotificationSchema);
export const SettingsModel: Model<any> = M.Settings || model("Settings", SettingsSchema);
