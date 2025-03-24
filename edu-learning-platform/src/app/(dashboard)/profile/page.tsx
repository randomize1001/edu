"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Edit,
  Save,
  Settings,
  UserCircle,
  Award // Changed from Certificate to Award
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in");
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "Learning enthusiast passionate about web development and data science.",
    location: "San Francisco, CA",
    website: "https://example.com",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: "1",
      title: "Introduction to Web Development",
      progress: 45,
      lastAccessed: "2 days ago",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "2",
      title: "Python for Data Science",
      progress: 20,
      lastAccessed: "5 days ago",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHl0aG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
  ];

  // Mock certificates data
  const certificates = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      issueDate: "June 15, 2023",
      instructor: "Jane Smith",
    },
  ];

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                <AvatarFallback className="text-2xl">{(session?.user?.name?.charAt(0) || "U").toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{profileData.fullName}</CardTitle>
              <CardDescription>{profileData.email}</CardDescription>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>

            {!isEditing ? (
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Bio</h3>
                  <p>{profileData.bio}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Location</h3>
                  <p>{profileData.location}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Website</h3>
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profileData.website}
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Account type</h3>
                  <p className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {session?.user?.role === "admin" ? "Admin" : "Student"}
                  </p>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <h2 className="text-2xl font-bold">My Learning</h2>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-36 h-24 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow space-y-3">
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Clock className="h-4 w-4" />
                                <span>Last accessed {course.lastAccessed}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <Button>Continue Learning</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No courses yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Button asChild>
                      <a href="/courses">Browse Courses</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <h2 className="text-2xl font-bold">My Certificates</h2>
              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-4">
                            <Award className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-grow text-center md:text-left">
                            <h3 className="font-semibold">{certificate.title}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center justify-center md:justify-start gap-1">
                                <UserCircle className="h-4 w-4" />
                                <span>Instructor: {certificate.instructor}</span>
                              </div>
                              <div className="flex items-center justify-center md:justify-start gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>Issued: {certificate.issueDate}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" className="flex-shrink-0">
                            View Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No certificates yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Complete a course to earn your first certificate
                    </p>
                    <Button asChild>
                      <a href="/courses">Browse Courses</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications from EduLearn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Course updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new course content
                      </p>
                    </div>
                    <div className="h-6 w-11 bg-primary rounded-full relative">
                      <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Promotional emails</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new courses and special offers
                      </p>
                    </div>
                    <div className="h-6 w-11 bg-muted rounded-full relative">
                      <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Password</CardTitle>
                  <CardDescription>
                    Update your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Delete Account</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
