import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";

const SearchButton = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log("Searching for:", searchQuery);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex hover:bg-primary/10 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Tìm kiếm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm giày, phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tìm kiếm phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Nike Air Max",
                "Adidas Yeezy",
                "Converse Chuck",
                "Vans Old Skool",
              ].map((keyword) => (
                <Button
                  key={keyword}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(keyword)}
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchButton;
