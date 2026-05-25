import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Ruler } from "lucide-react";
import { Button } from "~/components/ui/button";

// Định nghĩa màu sắc cho từng hệ thống size để đồng nhất
export const SYSTEM_COLORS: Record<string, string> = {
  US: "bg-blue-100 text-blue-800 border-blue-200",
  UK: "bg-red-100 text-red-800 border-red-200",
  EU: "bg-indigo-100 text-indigo-800 border-indigo-200",
  CM: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const SYSTEM_LABELS: Record<string, string> = {
  US: "Mỹ (United States)",
  UK: "Anh (United Kingdom)",
  EU: "Châu Âu (European Union)",
  CM: "Centimet (Chiều dài chân)",
};

const SIZE_SYSTEMS = [
  {
    code: "US",
    name: "Mỹ",
    description: "Hệ thống đo lường tiêu chuẩn của Mỹ.",
    color: "blue",
  },
  {
    code: "UK",
    name: "Anh",
    description: "Hệ thống đo lường tiêu chuẩn của Anh.",
    color: "red",
  },
  {
    code: "EU",
    name: "Châu Âu",
    description: "Hệ thống đo lường phổ biến tại Châu Âu và Việt Nam.",
    color: "indigo",
  },
  {
    code: "CM",
    name: "Centimet",
    description: "Đo chiều dài bàn chân, độ chính xác cao nhất.",
    color: "emerald",
  },
];

export const SneakerSizeGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto gap-1 text-primary">
          <Ruler className="w-4 h-4" />
          Hướng dẫn chọn size
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thông tin kích cỡ giày</DialogTitle>
          <DialogDescription>
            Hiểu rõ về các hệ thống đo lường kích cỡ giày để chọn đúng size cho
            bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Hệ thống</TableHead>
                  <TableHead>Mô tả</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SIZE_SYSTEMS.map((system) => (
                  <TableRow key={system.code}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={SYSTEM_COLORS[system.code]}
                        >
                          {system.code}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{system.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {system.description}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Mẹo:</strong> Nếu chân bạn bè, hãy chọn size lớn hơn 0.5
            size so với bình thường để thoải mái hơn.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SneakerSizeGuide;
