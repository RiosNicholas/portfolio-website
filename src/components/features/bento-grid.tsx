import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface BentoGridItem {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  content?: React.ReactNode;
}

export default function BentoGrid({ items }: { items: BentoGridItem[] }) {   
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card className="p-4" key={item.label}>
          <CardHeader>
            <CardTitle className="font-semibold flex gap-2 items-center justify-start">
              {item.icon} {item.label}
            </CardTitle>
          </CardHeader>
          <CardDescription>{item.description}</CardDescription>
          {item.content && <CardContent>{item.content}</CardContent>}
        </Card>
      ))}
    </div>
  )
}