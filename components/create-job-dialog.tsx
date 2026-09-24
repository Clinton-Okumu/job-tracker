"use client";

import { Building2, DollarSign, Globe, Loader2, MapPin, Plus, Sparkles, Tag } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
};

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createJobApplication({
        ...formData,
        columnId,
        boardId,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setFormData(INITIAL_FORM_DATA);
        setOpen(false);
      } else {
        console.error("Failed to create job: ", result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full mb-3 justify-center text-muted-foreground border-dashed border-2 hover:border-primary/50 hover:text-primary hover:bg-primary/5 rounded-xl h-10 transition-all gap-2 text-xs font-semibold shadow-2xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <span>New Job Application</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Add a position you are targeting or tracking
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company-create" className="text-xs font-semibold">
                Company *
              </Label>
              <Input
                id="company-create"
                required
                placeholder="e.g. Stripe, Google"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="rounded-xl h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position-create" className="text-xs font-semibold">
                Position *
              </Label>
              <Input
                id="position-create"
                required
                placeholder="e.g. Frontend Engineer"
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
              <Label htmlFor="location-create" className="text-xs font-semibold">
                Location
              </Label>
              <Input
                id="location-create"
                placeholder="e.g. Remote, San Francisco"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="rounded-xl h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary-create" className="text-xs font-semibold">
                Salary
              </Label>
              <Input
                id="salary-create"
                placeholder="e.g. $130k - $160k"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="rounded-xl h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jobUrl-create" className="text-xs font-semibold">
              Job URL
            </Label>
            <Input
              id="jobUrl-create"
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
            <Label htmlFor="tags-create" className="text-xs font-semibold">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags-create"
              placeholder="React, TypeScript, Remote"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="rounded-xl h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description-create" className="text-xs font-semibold">
              Description
            </Label>
            <Textarea
              id="description-create"
              rows={2}
              placeholder="Brief description of the role..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes-create" className="text-xs font-semibold">
              Notes
            </Label>
            <Textarea
              id="notes-create"
              rows={3}
              placeholder="Referrals, recruiter contacts, initial thoughts..."
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
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl shadow-md shadow-primary/20 gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
