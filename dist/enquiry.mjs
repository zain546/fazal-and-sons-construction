export const BUSINESS_PHONE = '923003732847';
export const SERVICES = ['New construction', 'Structure & concrete', 'Project consultation', 'Other'];

export function validateEnquiry(values) {
  const clean = (value, limit) => String(value ?? '').trim().slice(0, limit);
  const enquiry = { name: clean(values.name, 100), type: clean(values.type, 60), location: clean(values.location, 120), message: clean(values.message, 1500) };
  const errors = {};
  if (!enquiry.name) errors.name = 'Please enter your name.';
  if (!SERVICES.includes(enquiry.type)) errors.type = 'Please select a project type.';
  if (!enquiry.location) errors.location = 'Please enter the project area or location.';
  return { enquiry, errors };
}

export function createBrief(enquiry) {
  return `Hello Fazal & Sons,\nI'm ${enquiry.name}.\nProject: ${enquiry.type}\nLocation: ${enquiry.location}${enquiry.message ? `\nDetails: ${enquiry.message}` : ''}\nI'd like to discuss the next steps.`;
}

export function whatsappUrl(brief) {
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(brief)}`;
}
