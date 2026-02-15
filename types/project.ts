export interface JobPosting {
  jobId?: number;
  companyName: string;
  roleTitle: string;
  roleDescription: string;
  venue: string;
  salary: string;
  ctc?: string;
  lastDate: string;
  companyLink: string;
  createdAt: string;
  isActive?: boolean;
  jobContacts?: { name: string; designation: string; email?: string; phone?: string }[];
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  selectedFilters: Record<string, string | string[]>;
}

export interface JobContact {
  contactId?: number;
  name: string;
  designation: string;
  email?: string;
  phone?: string;
}

export interface FilterOption {
  optionId: number;
  optionName: string;
}

export interface Filter {
  categoryId: number;
  categoryName: string;
  inputType: "single-select" | "multi-select" | "range-slider" | "text";
  minValue?: number;
  maxValue?: number;
  options: FilterOption[];
}

// Legacy types (kept for backward compatibility)
export interface Project {
  projectId?: number;
  projectName: string;
  projectDescription: string;
  projectLink: string;
  members?: { name: string; linkedin: string }[];
  createdAt: string;
  customDomain?: string;
  categories?: { categoryName: string; optionName: string }[];
  contactInstagram?: string;
  contactLinkedIn?: string;
  contactEmail?: string;
  contactWhatsApp?: string;
  selectedCategoryOptions: Record<string, string | string[]>;
}

export interface CategoryOption {
  optionId: number;
  optionName: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  inputType: "single-select" | "multi-select" | "range-slider" | "text";
  minValue?: number;
  maxValue?: number;
  options: CategoryOption[];
}

