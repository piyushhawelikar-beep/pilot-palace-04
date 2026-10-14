import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function FeedbackDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) return setErr("Please write at least 10 characters.");
    const drafts = JSON.parse(localStorage.getItem("devpilot.feedback") ?? "[]");
    localStorage.setItem(
      "devpilot.feedback",
      JSON.stringify([...drafts, { text, at: new Date().toISOString() }]),
    );
    toast.success("Feedback saved locally", {
      description: "No feedback service is connected yet, so it stays in this browser.",
    });
    setText("");
    setErr("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>What's working, what's broken, what's missing?</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Label htmlFor="fb">Your feedback</Label>
          <Textarea
            id="fb"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={!!err}
            aria-describedby="fb-err"
          />
          {err && (
            <p id="fb-err" className="text-sm text-destructive">
              {err}
            </p>
          )}
          <Button type="submit" className="w-full">
            Save feedback
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
