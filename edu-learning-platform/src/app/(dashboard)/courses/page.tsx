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
import { BookOpen, Clock, Filter, Search, Star, Users } from "lucide-react";

// Sample course data
const COURSES = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript",
    instructorName: "Jane Smith",
    duration: "10 hours",
    level: "Beginner",
    students: 1234,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    category: "Web Development",
  },
  {
    id: "2",
    title: "Python for Data Science",
    description: "Master Python for data analysis and machine learning",
    instructorName: "David Johnson",
    duration: "15 hours",
    level: "Intermediate",
    students: 2845,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHl0aG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Data Science",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the principles of effective user interface design",
    instructorName: "Sarah Williams",
    duration: "8 hours",
    level: "Beginner",
    students: 1567,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHVpJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Design",
  },
  {
    id: "4",
    title: "Advanced JavaScript Frameworks",
    description: "Deep dive into React, Vue, and Angular",
    instructorName: "Michael Brown",
    duration: "12 hours",
    level: "Advanced",
    students: 987,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGphdmFzY3JpcHR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    category: "Web Development",
  },
  {
    id: "5",
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO, social media marketing, and analytics",
    instructorName: "Emily Clark",
    duration: "9 hours",
    level: "Beginner",
    students: 2134,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fG1hcmtldGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    category: "Marketing",
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps with React Native",
    instructorName: "Robert Wilson",
    duration: "14 hours",
    level: "Intermediate",
    students: 1432,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Web Development",
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Filter courses based on search term, category, and level
  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = Array.from(new Set(COURSES.map((course) => course.category)));
  const levels = Array.from(new Set(COURSES.map((course) => course.level)));

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground mt-1">
            Discover our wide range of courses to enhance your skills
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-[300px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLevel(null);
                }}
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
                        selectedCategory === category
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Level</h3>
                <div className="space-y-1">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                      className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
                        selectedLevel === level
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No courses found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
              <Button className="mt-4" onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setSelectedLevel(null);
              }}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-video w-full relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          by {course.instructorName}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {course.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-amber-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Enroll Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
