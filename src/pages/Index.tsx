import { useState } from "react";
import { Upload, Loader2, Zap, User, Home, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

interface BillData {
  "Customer Name": string;
  "Address": string;
  "Previous Reading": number;
  "Present Reading": number;
  "Units": number;
  "Current Bill": number;
  "Payable Within Due Date": string;
  "Bill Month": string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const uploadBill = async () => {
    if (!file) return;

    setLoading(true);
    setBillData(null);

    try {
      const formData = new FormData();
      formData.append("billFile", file);

      const response = await fetch("https://muhammadowais12.app.n8n.cloud/webhook-test/bill", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process bill");
      }

      const data = await response.json();
      setBillData(data);
      
      toast({
        title: "Success! ✨",
        description: "Your bill has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-soft)] mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              💡 Smart Bill Checker
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your electricity bill and get instant, detailed analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm bg-card/80">
            <CardContent className="p-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-soft)]">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  {file ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Drop your bill here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, and PDF files (max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {file && !loading && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={uploadBill}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)] text-lg px-8"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Bill
                  </Button>
                </div>
              )}

              {loading && (
                <div className="mt-8 flex flex-col items-center space-y-4 animate-fade-in">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-lg font-medium text-foreground">Analyzing your bill…</p>
                  <p className="text-sm text-muted-foreground">This will only take a moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {billData && !loading && (
            <Card className="shadow-[var(--shadow-card)] border-border/50 backdrop-blur-sm bg-card/80 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bill Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Customer Name</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{billData["Customer Name"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Bill Month</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{billData["Bill Month"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50 md:col-span-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Home className="w-4 h-4" />
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{billData["Address"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div className="flex items-center space-x-2 text-accent">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Previous Reading</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{billData["Previous Reading"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div className="flex items-center space-x-2 text-accent">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Present Reading</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{billData["Present Reading"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center space-x-2 text-primary">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Units Consumed</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{billData["Units"]}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                    <div className="flex items-center space-x-2 text-secondary">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Current Bill</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{billData["Current Bill"]}</p>
                  </div>

                  <div className="md:col-span-2 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Payable Within Due Date</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {billData["Payable Within Due Date"]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
