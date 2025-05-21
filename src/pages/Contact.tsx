
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Construct mailto URL with form data
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    );
    const mailtoUrl = `mailto:support@color-grid-logic-puzzle.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    toast.success("Email client opened. Please send your message to complete the process.");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="mb-6 text-muted-foreground">
            Have questions, feedback, or need assistance with Color Grid Logic? 
            Fill out the form below, and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
              <Input
                id="subject"
                placeholder="Question about Color Grid Logic"
                {...register("subject", { required: "Subject is required" })}
                aria-invalid={errors.subject ? "true" : "false"}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">Message</label>
              <Textarea
                id="message"
                placeholder="Your message here..."
                rows={5}
                {...register("message", { required: "Message is required" })}
                aria-invalid={errors.message ? "true" : "false"}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground">
            You can also reach us directly at:{" "}
            <a href="mailto:support@color-grid-logic-puzzle.com" className="text-blue-600 hover:underline">
              support@color-grid-logic-puzzle.com
            </a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
