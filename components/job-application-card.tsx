"use client";

import { JobApplication, Column } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import {
  Banknote,
  Building2,
  Calendar,
  Edit2,
  ExternalLink,
  GripVertical,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

// Generate consistent soft avatar color from company name
function getCompanyColor(name: string) {
  const colors = [
    "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "bg-rose-500/10 text-rose-600 border-rose-500/20",
    "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "bg-sky-500/10 text-sky-600 border-sky-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update job application: ", err);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteJobApplication(job._id);
      if (result.error) {
        console.error("Failed to delete job application:", result.error);
      }
    } catch (err) {
      console.error("Failed to delete job application: ", err);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (err) {
      console.error("Failed to move job application: ", err);
    }
  }

  const avatarColor = getCompanyColor(job.company || "Company");

  return (
    <>
      <Card
        className="group relative cursor-grab active:cursor-grabbing rounded-xl border border-border/70 bg-card p-0 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
        {...dragHandleProps}
      >
        <CardContent className="p-3.5 space-y-2.5">
          {/* Header with Company Avatar & Actions */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-bold text-xs uppercase tracking-wider ${avatarColor}`}
              >
                {job.company?.[0] || <Building2 className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                  {job.position}
                </h3>
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-1 shrink-0">
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                  title="Open Job Link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border/80">
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2 cursor-pointer">
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Edit Details</span>
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Move to Column
                      </div>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((column) => (
                          <DropdownMenuItem
                            key={column._id}
                            onClick={() => handleMove(column._id)}
                            className="cursor-pointer text-xs"
                          >
                            {column.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{isDeleting ? "Deleting..." : "Delete Job"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Description preview */}
          {job.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded-lg">
              {job.description}
            </p>
          )}

          {/* Details Row: Location & Salary */}
          {(job.location || job.salary) && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-medium pt-0.5">
              {job.location && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5">
                  <MapPin className="h-3 w-3 text-muted-foreground/80" />
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5">
                  <Banknote className="h-3 w-3" />
                  {job.salary}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md border border-primary/15 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-xl rounded-2xl p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              Edit Job Application
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Update information and notes for this role
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 pt-2" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold">
                  Company *
                </Label>
                <Input
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position" className="text-xs font-semibold">
                  Position *
                </Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Remote, New York"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary" className="text-xs font-semibold">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g. $120k - $140k"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="rounded-xl h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobUrl" className="text-xs font-semibold">
                Job Posting URL
              </Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-xs font-semibold">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                placeholder="React, Next.js, High Pay"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Short Description
              </Label>
              <Textarea
                id="description"
                rows={2}
                placeholder="Brief summary of requirements or team..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-xl resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold">
                Interview / Preparation Notes
              </Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Questions asked, recruiter contact, next steps..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="rounded-xl resize-none"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl shadow-md shadow-primary/20">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
