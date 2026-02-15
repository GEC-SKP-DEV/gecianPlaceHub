import { MapPin, DollarSign, Briefcase, Link as LinkIcon, Mail, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project | any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Support both new schema keys and legacy keys
  const companyName = project.companyName ?? project.projectName ?? project.company;
  const roleName = project.roleName ?? project.roleTitle ?? project.projectName;
  const jobType = project.jobType ?? project.categories?.find((c: any) => c.categoryName === "Job Type")?.optionName;
  const department = project.department ?? project.categories?.find((c: any) => c.categoryName === "Department")?.optionName;
  const qualification = project.qualification ?? project.categories?.find((c: any) => c.categoryName === "Qualification")?.optionName;
  const backlog = project.backlog ?? project.categories?.find((c: any) => c.categoryName === "Backlog")?.optionName;
  const passoutYear = project.passoutYear ?? project.categories?.find((c: any) => c.categoryName === "Passout Year")?.optionName;
  const venue = project.venue ?? project.categories?.find((c: any) => c.categoryName === "Venue")?.optionName ?? project.customDomain;
  const ctc = project.ctc ?? project.salary ?? project.ctcRange ?? project.salaryRange;
  const registrationDeadline = project.registrationDeadline ? new Date(project.registrationDeadline) : project.lastDate ? new Date(project.lastDate) : null;
  const googleFormLink = project.googleFormLink ?? project.projectLink ?? project.companyLink;

  const id = project.projectId ?? project.jobId ?? project.id;

  return (
    <Link href={`/projects/${id}`} className="block">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="md:flex">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 md:w-1/3">
            <h2 className="text-white text-xl font-semibold mb-2">{companyName}</h2>
            <p className="text-green-100 text-sm font-medium mb-2">{roleName}</p>
            <p className="text-green-100 text-xs">Click to view full details</p>
          </div>

          <div className="p-6 space-y-4 md:w-2/3 md:flex md:flex-col md:justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 group">
                <Briefcase className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-500 text-xs">Job Type</p>
                  <p className="text-gray-800 font-medium">{jobType ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-500 text-xs">CTC</p>
                  <p className="text-gray-800 font-medium">{ctc ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-500 text-xs">Venue</p>
                  <p className="text-gray-800 font-medium">{venue ?? "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-gray-500 text-xs">Department</p>
                <p className="text-gray-800 font-medium">{department ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Passout Year</p>
                <p className="text-gray-800 font-medium">{passoutYear ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Backlog</p>
                <p className="text-gray-800 font-medium">{backlog ?? "N/A"}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-500 text-xs">Registration Deadline</p>
                  <p className="text-gray-800 font-medium">{registrationDeadline ? registrationDeadline.toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              <div>
                <a
                  href={googleFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Apply / Register</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
