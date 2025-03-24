"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  FileUp,
  FolderUp,
  Upload,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in");
    },
  });

  // Only admins can access this page
  if (session?.user?.role !== "admin") {
    redirect("/courses");
  }

  const [linkboxToken, setLinkboxToken] = useState("");
  const [linkboxFolderId, setLinkboxFolderId] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: string }[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    // Add all files to the list with "pending" status
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      status: "pending"
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const configureLinkbox = () => {
    if (!linkboxToken || !linkboxFolderId) {
      toast.error("Please provide both Linkbox Token and Folder ID");
      return;
    }

    // In a real application, we would validate these credentials against the Linkbox API
    setIsConfigured(true);
    toast.success("Linkbox Cloud configuration saved");
  };

  const uploadFiles = async () => {
    if (!isConfigured) {
      toast.error("Please configure Linkbox Cloud first");
      return;
    }

    if (!courseName) {
      toast.error("Please provide a course name");
      return;
    }

    setUploading(true);

    // Simulate file upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      // Update status of files as they "upload"
      if (progress > 30 && uploadedFiles.length > 0) {
        setUploadedFiles(prev => {
          const updated = [...prev];
          const pendingIndex = updated.findIndex(file => file.status === "pending");
          if (pendingIndex !== -1) {
            updated[pendingIndex].status = "uploading";
          }
          return updated;
        });
      }

      if (progress > 60 && uploadedFiles.length > 0) {
        setUploadedFiles(prev => {
          const updated = [...prev];
          const uploadingIndex = updated.findIndex(file => file.status === "uploading");
          if (uploadingIndex !== -1) {
            updated[uploadingIndex].status = "complete";
          }
          return updated;
        });
      }

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadProgress(0);

        // Mark all remaining files as complete
        setUploadedFiles(prev => prev.map(file => ({ ...file, status: "complete" })));

        toast.success("Course materials uploaded successfully");

        // Clear form after successful upload
        setCourseName("");
        setCourseDescription("");
        setUploadedFiles([]);
      }
    }, 200);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="upload">
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Course Content</TabsTrigger>
          <TabsTrigger value="settings">Linkbox Settings</TabsTrigger>
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Course Materials</CardTitle>
              <CardDescription>
                Upload videos, PDFs, and other course materials to Linkbox Cloud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConfigured && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-md flex items-start gap-3 border border-amber-200">
                  <Info className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Linkbox Cloud not configured</p>
                    <p className="text-sm">Please configure your Linkbox Cloud settings first</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Introduction to Web Development"
                    disabled={uploading || !isConfigured}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Course Description</Label>
                  <Input
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Learn the fundamentals of web development"
                    disabled={uploading || !isConfigured}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course Materials</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                      isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    } ${!isConfigured ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} disabled={uploading || !isConfigured} />
                    <div className="flex flex-col items-center gap-2">
                      <FolderUp className="h-8 w-8 text-muted-foreground" />
                      {isDragActive ? (
                        <p>Drop the files here...</p>
                      ) : (
                        <>
                          <p className="font-medium">Drag & drop files here</p>
                          <p className="text-sm text-muted-foreground">
                            Or click to select files (videos, PDFs, documents)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-3 font-medium">Uploaded Files</div>
                    <div className="divide-y">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {file.name.endsWith(".mp4") || file.name.endsWith(".mov") ? (
                              <Video className="h-5 w-5 text-blue-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-orange-500" />
                            )}
                            <span>{file.name}</span>
                          </div>
                          <div>
                            {file.status === "pending" && (
                              <span className="text-sm text-muted-foreground">Pending</span>
                            )}
                            {file.status === "uploading" && (
                              <span className="text-sm text-amber-500">Uploading...</span>
                            )}
                            {file.status === "complete" && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {file.status === "error" && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={uploadFiles}
                  disabled={uploading || !isConfigured || !courseName || uploadedFiles.length === 0}
                  className="w-full"
                >
                  {uploading ? "Uploading..." : "Upload to Linkbox Cloud"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linkbox Cloud Configuration</CardTitle>
              <CardDescription>
                Configure your Linkbox Cloud account for uploading course materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkboxToken">Linkbox API Token</Label>
                  <Input
                    id="linkboxToken"
                    value={linkboxToken}
                    onChange={(e) => setLinkboxToken(e.target.value)}
                    placeholder="Enter your Linkbox API token"
                    type="password"
                  />
                  <p className="text-sm text-muted-foreground">
                    Find your API token at{" "}
                    <a
                      href="https://www.linkbox.to/admin/account"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Linkbox Account Page
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkboxFolderId">Linkbox Folder ID</Label>
                  <Input
                    id="linkboxFolderId"
                    value={linkboxFolderId}
                    onChange={(e) => setLinkboxFolderId(e.target.value)}
                    placeholder="Enter your Linkbox Folder ID"
                  />
                  <p className="text-sm text-muted-foreground">
                    Create a folder at{" "}
                    <a
                      href="https://www.linkbox.to/admin/my-files"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Linkbox Files
                    </a>{" "}
                    and copy the folder ID from the URL
                  </p>
                </div>

                <Button onClick={configureLinkbox} className="w-full">
                  {isConfigured ? "Update Configuration" : "Save Configuration"}
                </Button>

                {isConfigured && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-start gap-3 border border-green-200">
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Linkbox Cloud configured</p>
                      <p className="text-sm">Your Linkbox Cloud account is connected</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Courses</CardTitle>
              <CardDescription>
                View and manage all your uploaded courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No courses uploaded yet</p>
                <p className="text-sm max-w-md mx-auto mt-2">
                  Upload your first course using the Upload Course Content tab to see it here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
