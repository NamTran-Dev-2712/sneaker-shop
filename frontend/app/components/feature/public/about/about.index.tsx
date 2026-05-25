import {
  Target,
  Heart,
  Award,
  Users,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Mission and Values
const values = [
  {
    icon: Target,
    title: "Chất Lượng",
    description:
      "Cam kết 100% sản phẩm chính hãng, đảm bảo chất lượng tốt nhất cho khách hàng.",
  },
  {
    icon: Heart,
    title: "Tận Tâm",
    description:
      "Luôn lắng nghe và phục vụ khách hàng với sự nhiệt tình và chân thành nhất.",
  },
  {
    icon: Award,
    title: "Uy Tín",
    description:
      "Xây dựng niềm tin thông qua chính sách minh bạch và dịch vụ hậu mãi tốt.",
  },
  {
    icon: Users,
    title: "Cộng Đồng",
    description:
      "Kết nối những người yêu thích sneaker, chia sẻ đam mê và phong cách.",
  },
];

// Team members (mock)
const team = [
  {
    name: "Nguyễn Văn A",
    role: "Founder & CEO",
    avatar: "",
    description: "10 năm kinh nghiệm trong ngành thời trang",
  },
  {
    name: "Trần Thị B",
    role: "Head of Operations",
    avatar: "",
    description: "Chuyên gia vận hành và logistics",
  },
  {
    name: "Lê Văn C",
    role: "Marketing Director",
    avatar: "",
    description: "Sáng tạo và phát triển thương hiệu",
  },
  {
    name: "Phạm Thị D",
    role: "Customer Service Lead",
    avatar: "",
    description: "Đam mê phục vụ khách hàng",
  },
];

// Store locations
const stores = [
  {
    name: "Sneaker Shop - Quận 1",
    address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    hours: "09:00 - 22:00",
  },
  {
    name: "Sneaker Shop - Quận 7",
    address: "456 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM",
    phone: "028 8765 4321",
    hours: "09:00 - 22:00",
  },
];

const AboutIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Về Sneaker Shop
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Đam mê, Chất lượng, và Phong cách - Hành trình mang đến những đôi
            giày sneaker tốt nhất cho bạn
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" />
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Sneaker Shop được thành lập vào năm 2020 bởi những người trẻ
                  đam mê sneaker. Từ một cửa hàng nhỏ, chúng tôi đã phát triển
                  thành một hệ thống bán lẻ giày sneaker hàng đầu tại Việt Nam.
                </p>
                <p>
                  Với mong muốn mang đến cho khách hàng những sản phẩm chính
                  hãng với giá tốt nhất, chúng tôi không ngừng mở rộng nguồn
                  hàng và cải thiện dịch vụ.
                </p>
                <p>
                  Hiện tại, Sneaker Shop đã có hơn 500 mẫu giày từ các thương
                  hiệu nổi tiếng như Nike, Adidas, Converse, Vans, New Balance
                  và nhiều hơn nữa.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80"
                alt="Sneaker collection"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl">
                <p className="text-3xl font-bold">4+</p>
                <p className="text-sm opacity-90">Năm Kinh Nghiệm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border-0 shadow-sm text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Những con người đam mê và tận tâm, luôn nỗ lực mang đến trải nghiệm
            tốt nhất cho khách hàng
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="border-0 shadow-sm text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Hệ Thống Cửa Hàng
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stores.map((store) => (
              <Card key={store.name} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{store.name}</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutIndex;
