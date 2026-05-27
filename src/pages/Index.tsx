import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateEmail } from "@/lib/ai";
import { cn } from "@/lib/utils";
import {
  Mail,
  Copy,
  Loader2,
  Sparkles,
  LogOut,
  Crown,
  RefreshCw,
  MessageCircle,
  CalendarIcon,
  FileDown,
  Moon,
  Sun,
} from "lucide-react";

const FREE_DAILY_LIMIT = 3;

const STUDENT_SUB_PURPOSES = [
  "Leave Application",
  "Sick Leave",
  "Exam Leave",
  "Fee Extension Request",
  "Assignment / Project Extension",
  "Certificate / Bonafide Request",
  "Internship Request",
];

const LEAVE_REASONS = [
  "Medical / Health Issue",
  "Family Emergency",
  "Personal Work",
  "Festival / Religious Reason",
  "Exam / Study Related",
  "Travel / Outstation",
  "Mental Health / Rest",
  "Official Work",
  "Weather / Transport Issue",
  "Other",
];

const LEAVE_SUB_PURPOSES = ["Leave Application", "Sick Leave", "Exam Leave"];

const INDUSTRIES = [
  "IT / Software",
  "Marketing / Agency",
  "Real Estate",
  "Education",
  "Finance",
  "E-commerce",
];

const USER_MODES = [
  { value: "Student", label: "Student" },
  { value: "Employee", label: "Employee" },
  { value: "Teacher", label: "Teacher" },
];

const AUTO_TONE: Record<string, string> = {
  Student: "Respectful",
  Employee: "Professional",
  Teacher: "Formal",
};

const Index = () => {
  // Manual Theme Logic (No dependency needed)
  const { id } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost/leavecraft/backend/get-single-chat.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setBody(data.chat.generated_email);
          setPurpose(data.chat.prompt);
        }
      });
  }, [id]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toast = (msg: any) => alert(msg.title || msg);
  const navigate = useNavigate();

  // Logic States
  const [fullName, setFullName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [userMode, setUserMode] = useState("");
  const [studentSubPurpose, setStudentSubPurpose] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleOrService, setRoleOrService] = useState("");
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("English");
  const [followUp, setFollowUp] = useState("none");
  const [industry, setIndustry] = useState("none");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [leaveReason, setLeaveReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [subjectA, setSubjectA] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const isStudent = purpose === "Student";
  const [emailType, setEmailType] = useState<string>("");
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const isLeaveType =
    isStudent &&
    (studentSubPurpose === "Leave Application" ||
      studentSubPurpose === "Sick Leave" ||
      studentSubPurpose === "Exam Leave");

  LEAVE_SUB_PURPOSES.includes(studentSubPurpose);
  const needsOtherReason = isLeaveType && leaveReason === "Other";
  const isLeaveFlow = isLeaveType || userMode !== "";

  const canGenerate =
    fullName &&
    purpose &&
    companyName &&
    roleOrService &&
    tone &&
    (!isStudent || studentSubPurpose) &&
    (!isLeaveType || (leaveReason && (!needsOtherReason || otherReason))) &&
    selectedDate &&
    (dateMode === "single" || endDate) &&
    (!isLeaveType || userMode);

  const isLimitReached =
    subscriptionPlan === "free" && dailyCount >= FREE_DAILY_LIMIT;

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("user", user);
      const res = await fetch(
        "http://localhost/leavecraft/backend/get_usage.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setSubscriptionPlan(data.subscription_plan);
      setDailyCount(data.daily_count);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userMode && AUTO_TONE[userMode]) setTone(AUTO_TONE[userMode]);
  }, [userMode]);

  useEffect(() => {
    if (purpose !== "Student") {
      setStudentSubPurpose("");
      setUserMode("");
    }
    setLeaveReason("");
    setOtherReason("");
  }, [purpose]);

  useEffect(() => {
    setLeaveReason("");
    setOtherReason("");
  }, [studentSubPurpose]);

  useEffect(() => {
    if (dateMode === "single") setEndDate(undefined);
  }, [dateMode]);

  const formatDateStr = (d: Date) => format(d, "dd MMMM yyyy");

  const getDateString = () => {
    if (!selectedDate) return "";
    if (dateMode === "range" && endDate) {
      return `from ${formatDateStr(selectedDate)} to ${formatDateStr(endDate)}`;
    }
    return `on ${formatDateStr(selectedDate)}`;
  };

  const handleGenerate = async () => {
    setBody("");
    if (!canGenerate) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/leavecraft/backend/generate_email.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: localStorage.getItem("user_email"),
            name: fullName,
            purpose,
            company: companyName,
            role: roleOrService,
            tone,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // EMAIL SHOW
        setBody(data.email);

        setSubjectA("");

        // SAVE HISTORY
        await fetch("http://localhost/leavecraft/backend/save-history.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_email: localStorage.getItem("user_email"),

            prompt: purpose,

            generated_email: data.email,
          }),
        });
      } else {
        alert("Error: " + JSON.stringify(data.error));
      }
    } catch (err) {
      console.error(err);

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const getFullText = () => {
    const subjects = [subjectA && `Subject A: ${subjectA}`]
      .filter(Boolean)
      .join("\n");
    return subjects ? `${subjects}\n\nEmail Body:\n${body}` : body;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullText());
    toast({ title: "Copied to clipboard!" });
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getFullText())}`;
    window.open(url, "_blank");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("{purpose}", margin, y);
    y += 12;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    const dateLabel = selectedDate
      ? dateMode === "range" && endDate
        ? `Date: ${formatDateStr(selectedDate)} to ${formatDateStr(endDate)}`
        : `Date: ${formatDateStr(selectedDate)}`
      : "";
    if (dateLabel) {
      doc.text(dateLabel, margin, y);
      y += 10;
    }
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
    y += 10;
    doc.setTextColor(0);
    if (subjectA) {
      doc.setFont("helvetica", "bold");
      doc.text("Subject A:", margin, y);
      const subALines = doc.splitTextToSize(subjectA, maxWidth - 25);
      doc.text(subALines, margin + 25, y);
      y += subALines.length * 6 + 4;
    }
    y += 6;
    doc.setFont("helvetica", "normal");
    const bodyLines = doc.splitTextToSize(body, maxWidth);
    doc.text(bodyLines, margin, y);
    doc.save(`generated email.pdf`);
    toast({ title: "PDF downloaded!" });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg font-semibold">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-1 lg:px-2 py-1 space-y-1">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <div className="flex items-center gap-3"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r bg-gradient-to-r from-purple-600 to-indigo-300 bg-clip-text text-transparent bg-clip-text text-transparent">
            Cold Email Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Craft personalized, high-converting emails in seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {subscriptionPlan === "free" && (
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
              onClick={() => navigate("/upgrade")}
            >
              <Crown className="h-4 w-4 mr-2 text-amber-500" /> Upgrade
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("user_email");

              setIsLoggedIn(false);

              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {subscriptionPlan === "free" && (
        <div className="text-sm text-muted-foreground font-bold uppercase">
          <span
            className={
              isLimitReached ? "text-destructive" : "text-muted-foreground"
            }
          >
            {dailyCount}/{FREE_DAILY_LIMIT} free emails used today
          </span>
        </div>
      )}
      {/* --- MAIN GRID LAYOUT --- */}

      <div className="container mx-auto py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-5 space-y-6 overflow-visible">
              <Card className="rounded-2xl border bg-card/80 backdrop-blur-xl shadow-lg overflow-visible">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" /> Email Details
                  </CardTitle>

                  <CardDescription>
                    Fill in the details to generate your email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-visible">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
                    <div className="space-y-2 relative z-50 overflow-visible">
                      <Label>Purpose</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger
                          className={cn(
                            "w-full bg-background border border-input rounded-lg",
                            (purpose === "Job" ||
                              purpose === "Sales" ||
                              purpose === "Freelancing" ||
                              purpose === "Student") &&
                              "text-purple-600 border-purple-400 bg-purple-500/10"
                          )}
                        >
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          <SelectItem
                            value="Job"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Job Application
                          </SelectItem>
                          <SelectItem
                            value="Sales"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Sales Outreach
                          </SelectItem>
                          <SelectItem
                            value="Freelancing"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Freelancing
                          </SelectItem>
                          <SelectItem
                            value="Student"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Student
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 relative z-50 overflow-visible">
                      <Label>
                        Tone{" "}
                        {userMode && (
                          <span className="text-xs text-muted-foreground">
                            (auto)
                          </span>
                        )}
                      </Label>
                      <Select
                        value={tone}
                        onValueChange={setTone}
                        disabled={!!userMode}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full bg-background border border-input rounded-lg",
                            (tone === "Professional" ||
                              tone === "Friendly" ||
                              tone === "Respectful" ||
                              tone === "Formal") &&
                              "text-purple-600 border-purple-400 bg-purple-500/10"
                          )}
                        >
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          <SelectItem
                            value="Professional"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/2 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600"
                          >
                            Professional
                          </SelectItem>
                          <SelectItem
                            value="Friendly"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Friendly
                          </SelectItem>
                          <SelectItem
                            value="Respectful"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Respectful
                          </SelectItem>
                          <SelectItem
                            value="Formal"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            Formal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isStudent && (
                    <div className="space-y-2relative z-50 overflow-visible ">
                      <Label>Email Type</Label>
                      <Select
                        value={studentSubPurpose}
                        onValueChange={setStudentSubPurpose}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-background border border-input rounded-lg",
                            (studentSubPurpose === "Leave Application" ||
                              studentSubPurpose === "Sick Leave" ||
                              studentSubPurpose === "Exam Leave" ||
                              studentSubPurpose === "Fee Extension Request" ||
                              studentSubPurpose ===
                                "Assignment / Project Extension" ||
                              studentSubPurpose ===
                                "Certificate / Bonafide Request" ||
                              studentSubPurpose === "Internship Request") &&
                              "text-purple-600 border-purple-400 bg-purple-500/10"
                          )}
                        >
                          <SelectValue placeholder="Select email type" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          {STUDENT_SUB_PURPOSES.map((sp) => (
                            <SelectItem
                              key={sp}
                              value={sp}
                              className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                            >
                              {sp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isLeaveType && (
                    <div className="space-y-2">
                      <Label>User Mode</Label>
                      <Select value={userMode} onValueChange={setUserMode}>
                        <SelectTrigger
                          className={cn(
                            "bg-background border border-input rounded-lg",
                            (userMode === "Student" ||
                              userMode === "Employee" ||
                              userMode === "Teacher") &&
                              "text-purple-600 border-purple-400 bg-purple-500/10"
                          )}
                        >
                          <SelectValue placeholder="Select user mode" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          {USER_MODES.map((m) => (
                            <SelectItem
                              key={m.value}
                              value={m.value}
                              className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                            >
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isLeaveType && (
                    <div className="space-y-2">
                      <Label>Leave Reason</Label>
                      <Select
                        value={leaveReason}
                        onValueChange={setLeaveReason}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-background border border-inpur rounded-lg",
                            (leaveReason === "Medical / Health Issue" ||
                              leaveReason === "Family Emergency" ||
                              leaveReason === "Personal Work" ||
                              leaveReason === "Festival / Religious Reason" ||
                              leaveReason === "Exam / Study Related" ||
                              leaveReason === "Travel / Outstation" ||
                              leaveReason === "Mental Health / Rest" ||
                              leaveReason === "Official Work" ||
                              leaveReason === "Weather / Transport Issue" ||
                              leaveReason === "Other") &&
                              "text-purple-600 border-purple-400 bg-purple-500/10"
                          )}
                        >
                          <SelectValue placeholder="Select leave reason" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          {LEAVE_REASONS.map((r) => (
                            <SelectItem
                              key={r}
                              value={r}
                              className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                            >
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {needsOtherReason && (
                    <div className="space-y-2">
                      <Label htmlFor="otherReason">
                        Please specify your reason
                      </Label>
                      <Input
                        id="otherReason"
                        placeholder="Enter reason"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {isStudent ? "Institution / Recipient" : "Company Name"}
                    </Label>
                    <Input
                      id="companyName"
                      placeholder={isStudent ? "XYZ University" : "Acme Inc."}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleOrService">
                      {isStudent ? "Additional Details" : "Role or Service"}
                    </Label>
                    <Input
                      id="roleOrService"
                      placeholder={
                        isStudent ? "Roll No. 123" : "Frontend Developer"
                      }
                      value={roleOrService}
                      onChange={(e) => setRoleOrService(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up</Label>
                      <Select value={followUp} onValueChange={setFollowUp}>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          <SelectItem value="none">Original Email</SelectItem>
                          <SelectItem value="first">First Follow-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Label>
                        Date <span className="text-destructive">*</span>
                      </Label>

                      <div className="full flex border rounded-md overflow-visible text-sm">
                        <button
                          type="button"
                          className={cn(
                            "px-4 py-1.5",
                            dateMode === "single"
                              ? "w-full bg-gradient-to-r from-purple-500 text-white font-bold h-10 hover:scale-105 hover:-translate-y-0 hover:shadow-x1 hover:shadow-purple-500/40 active:scale-95 transition-all duration-300"
                              : "bg-background"
                          )}
                          onClick={() => setDateMode("single")}
                        >
                          Single
                        </button>

                        <button
                          type="button"
                          className={cn(
                            "px-4 py-1.5",
                            dateMode === "range"
                              ? "w-full bg-gradient-to-r from-purple-500 text-white font-bold h-10 hover:scale-105 hover:-translate-y-0 hover:shadow-x1 hover:shadow-purple-500/40 active:scale-95 transition-all duration-300"
                              : "bg-background"
                          )}
                          onClick={() => setDateMode("range")}
                        >
                          Range
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {/* START DATE */}
                      <input
                        type="date"
                        value={
                          selectedDate
                            ? new Date(selectedDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedDate(new Date(e.target.value))
                        }
                        className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-black dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />

                      {/* END DATE */}
                      {dateMode === "range" && (
                        <input
                          type="date"
                          value={
                            endDate
                              ? new Date(endDate).toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => setEndDate(new Date(e.target.value))}
                          min={
                            selectedDate
                              ? new Date(selectedDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-black dark:text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {!isStudent && (
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-[9999] bg-white dark:bg-slate-900 text-foreground border border-border shadow-2xl rounded-xl backdrop-blur-none opacity-100"
                        >
                          {" "}
                          <SelectItem
                            value="none"
                            className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10  data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-purple-600 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-600 data-[state=checked]:font-medium data-[state=checked]:shadow-sm"
                          >
                            None
                          </SelectItem>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 text-white font-bold h-12 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Email
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: OUTPUT */}
            <div className="lg:col-span-7 h-full">
              {body ? (
                <Card className="shadow-xl border-border bg-card sticky top-4 animate-in fade-in slide-in-from-bottom-4 transition-all">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h2 className="text-xl font-bold">
                        {purpose || "Generated Email"}
                      </h2>
                      <CardTitle className="text-lg">Generated Email</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCopy}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleWhatsAppShare}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownloadPDF}
                        >
                          <FileDown className="h-4 w-4 mr-1" /> PDF
                        </Button>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 text-white font-bold h-12 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 transition-all duration-300"
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {subjectA && (
                      <div className="rounded-xl bg-accent/50 px-4 py-3 border">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Subject
                        </p>
                        <p className="font-bold">{subjectA}</p>
                      </div>
                    )}
                    <div className="rounded-xl bg-muted/20 px-5 py-6 border min-h-[300px] flex items-center justify-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3"></p>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedHistory?.generated_email || body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mb-3 opacity-70" />
                  <h3 className="font-semibold text-lg">Preview Area</h3>
                  <p className="text-sm">Fill the form and generate email</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
