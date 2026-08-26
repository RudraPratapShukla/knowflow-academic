import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AddBlogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const tags = formData.get("tags") as string;
        const content = formData.get("content") as string;

        // Here we would typically send this to a backend API.
        // Since we are currently using frontend-only mock endpoints, 
        // we will simulate the API call and show a success message.
        console.log("Submitting new blog:", { title, author, tags, content });

        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Blog submitted successfully!",
                description: "Your blog has been published to KnowFlow.",
            });
            // Redirect to home or another appropriate page after submission
            navigate("/");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container max-w-2xl py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Add a New Blog</h1>
                    <p className="mt-2 text-muted-foreground">
                        Share your knowledge with the KnowFlow academic community. Fill out the details below to publish your original article.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="title">Blog Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Understanding Advanced Deadlock Prevention"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author">Author Name</Label>
                            <Input
                                id="author"
                                name="author"
                                placeholder="e.g. Dr. Sarah Chen"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                name="tags"
                                placeholder="e.g. OS, Algorithms, Theory"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Blog Content (Markdown supported)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Write your article content here..."
                            required
                            className="min-h-[300px] font-mono text-sm"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button type="button" variant="outline" className="mr-3" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Publish Blog"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
