import type { Testimonial } from "../types";

export const FAQS = [
  {
    q: "Which properties can I enquire about?",
    a: "We currently publish four official SMA properties: KURUNJI GARDEN, K.M.B GARDEN, S.M.A GARDEN and PRESTIGE GARDEN. Each has its original layout drawing available to inspect.",
  },
  {
    q: "Where are the properties located?",
    a: "KURUNJI GARDEN is in Narasinganur near Kootteradu on the Villupuram–Gingee National Highway, K.M.B GARDEN is in Omalur, S.M.A GARDEN is near Orathur Koot Road on the Villupuram–Gingee Road, and PRESTIGE GARDEN is in Karipatti village, Salem District.",
  },
  {
    q: "Can I inspect the original layout drawing?",
    a: "Yes. Open any property and use the layout viewer to zoom, pan and view the drawing full-screen so you can read plot numbers, boundaries and roads.",
  },
  {
    q: "Are prices shown on the website?",
    a: "Prices are available on request. Use the Enquire Now form on a property page and our team will share current pricing and available plots.",
  },
  {
    q: "Can I schedule a site visit online?",
    a: "Yes. Open a property and use 'Schedule site visit'. We confirm the appointment with you over WhatsApp or a call.",
  },
  {
    q: "Do you show map coordinates?",
    a: "We only show a map when verified coordinates are available. Until then, each property page displays the exact location text supplied in the brochure.",
  },
  {
    q: "How is my data used?",
    a: "We use your details only to respond to your enquiry, in line with our Privacy Policy. We never sell your data.",
  },
  {
    q: "Can NRIs buy property through SMA?",
    a: "Yes. Our team can assist with documentation and remote site visits. Currency and repatriation rules apply.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    _id: "t1",
    name: "Iyyanar Appan",
    role: "Property buyer",
    location: "Tamil Nadu",
    quote:
      "Naanga plot vaanganum nu search pannitu irundhom. SMA Real Estate team romba friendly-ah guide pannanga. Ella details-um clear-ah explain pannanga. Overall experience romba nalla irundhuchu. Thank you SMA team!",
    rating: 5,
    avatar: "/reviews/iyyanar-appan.jpeg",
  },
  {
    _id: "t2",
    name: "Vengatesh",
    role: "Property buyer",
    location: "Tamil Nadu",
    quote:
      "Starting la konjam doubts irundhuchu, but SMA team ellathayum patiently explain pannanga. Enga requirements-ku suitable-ah properties suggest pannanga. Response-um quick-ah irundhuchu. Good service!",
    rating: 5,
    avatar: "/reviews/vengatesh.jpeg",
  },
  {
    _id: "t3",
    name: "Mohammed Thoufic",
    role: "Customer",
    location: "Tamil Nadu",
    quote:
      "Property details, location and layout pathi clear-ah information kuduthanga. Edhuvum hurry pannama engalukku understand aagura maari explain pannanga. Customer satisfaction-ku importance kudukkuranga. Really appreciate the team!",
    rating: 5,
    avatar: "/reviews/mohammed-thoufic.jpeg",
  },
  {
    _id: "t4",
    name: "Saranraj",
    role: "Land buyer",
    location: "Vikravandi",
    quote:
      "SMA Real Estate & Builders team-oda experience nalla irundhuchu. Site details paakuradhula irundhu enquiry varaikkum proper-ah support pannanga. Friendly approach and professional service. Definitely worth contacting!",
    rating: 4.5,
    avatar: "/reviews/saranraj.jpeg",
  },
];
