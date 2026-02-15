"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, DollarSign, Briefcase, Users, Mail, MessageCircle, Link as LinkIcon, ArrowLeft } from "lucide-react";

interface ProjectDetail {
  projectId?: number;
  companyName?: string;
  roleName?: string;
  jobType?: string;
  department?: string;
  qualification?: string;
  backlog?: string;
  passoutYear?: string;
  venue?: string;
  ctc?: string;
  registrationDeadline?: string;
  driveDate?: string;
  googleFormLink?: string;
  companyDescription?: string;
  createdAt?: string;
  contactEmail?: string;
  contactWhatsApp?: string;
  // Legacy fields
  projectName?: string;
  projectDescription?: string;
  projectLink?: string;
  customDomain?: string;
  members?: any[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const projects: ProjectDetail[] = await res.json();
        const found = projects.find((p) => p.projectId?.toString() === projectId);
        if (!found) {
          setError("Project not found");
        } else {
          setProject(found);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 mb-4">{error || "Project not found"}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const companyName = project.companyName ?? project.projectName ?? "Unknown Company";
  const roleName = project.roleName ?? "Unknown Role";
  const jobType = project.jobType;
  const department = project.department;
  const qualification = project.qualification;
  const backlog = project.backlog;
  const passoutYear = project.passoutYear;
  const venue = project.venue ?? project.customDomain;
  const ctc = project.ctc;
  const registrationDeadline = project.registrationDeadline ? new Date(project.registrationDeadline) : null;
  const driveDate = project.driveDate ? new Date(project.driveDate) : null;
  const googleFormLink = project.googleFormLink ?? project.projectLink;
  const description = project.companyDescription ?? project.projectDescription ?? "No description provided";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">{companyName}</h1>
          <h2 className="text-xl text-green-100 mb-4">{roleName}</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {jobType && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Job Type
              </p>
              <p className="text-lg font-semibold text-gray-800">{jobType}</p>
            </div>
          )}

          {department && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1">Department</p>
              <p className="text-lg font-semibold text-gray-800">{department}</p>
            </div>
          )}

          {qualification && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1">Qualification</p>
              <p className="text-lg font-semibold text-gray-800">{qualification}</p>
            </div>
          )}

          {passoutYear && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1">Passout Year</p>
              <p className="text-lg font-semibold text-gray-800">{passoutYear}</p>
            </div>
          )}

          {backlog && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1">Backlog</p>
              <p className="text-lg font-semibold text-gray-800">{backlog}</p>
            </div>
          )}

          {ctc && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> CTC
              </p>
              <p className="text-lg font-semibold text-gray-800">{ctc}</p>
            </div>
          )}

          {venue && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Venue
              </p>
              <p className="text-lg font-semibold text-gray-800">{venue}</p>
            </div>
          )}

          {registrationDeadline && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Registration Deadline
              </p>
              <p className="text-lg font-semibold text-gray-800">{registrationDeadline.toLocaleDateString()}</p>
            </div>
          )}

          {driveDate && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Drive Date
              </p>
              <p className="text-lg font-semibold text-gray-800">{driveDate.toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">About This Opportunity</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
        </div>

        {/* Contact Section */}
        {(project.contactEmail || project.contactWhatsApp) && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> Contact Information
            </h3>
            <div className="space-y-4">
              {project.contactEmail && (
                <a
                  href={`mailto:${project.contactEmail}`}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">{project.contactEmail}</span>
                </a>
              )}
              {project.contactWhatsApp && (
                <a
                  href={`https://wa.me/${project.contactWhatsApp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">WhatsApp: {project.contactWhatsApp}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Apply Button */}
        {googleFormLink && (
          <div className="flex justify-center mb-8">
            <a
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <LinkIcon className="w-5 h-5" />
              Apply / Register Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
