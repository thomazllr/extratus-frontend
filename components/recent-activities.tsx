import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentActivities() {
  const activities = [
    {
      id: 1,
      user: {
        name: "João Silva",
        avatar: "/placeholder.svg",
        initials: "JS",
      },
      action: "adicionou",
      item: "Dipirona 500mg",
      quantity: 100,
      time: "há 5 minutos",
    },
    {
      id: 2,
      user: {
        name: "Maria Oliveira",
        avatar: "/placeholder.svg",
        initials: "MO",
      },
      action: "atualizou",
      item: "Amoxicilina 250mg",
      quantity: 50,
      time: "há 15 minutos",
    },
    {
      id: 3,
      user: {
        name: "Carlos Santos",
        avatar: "/placeholder.svg",
        initials: "CS",
      },
      action: "removeu",
      item: "Ibuprofeno 400mg",
      quantity: 25,
      time: "há 30 minutos",
    },
    {
      id: 4,
      user: {
        name: "Ana Pereira",
        avatar: "/placeholder.svg",
        initials: "AP",
      },
      action: "cadastrou cliente",
      item: "Roberto Almeida",
      time: "há 45 minutos",
    },
    {
      id: 5,
      user: {
        name: "Lucas Ferreira",
        avatar: "/placeholder.svg",
        initials: "LF",
      },
      action: "adicionou",
      item: "Paracetamol 750mg",
      quantity: 75,
      time: "há 1 hora",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.item}</span>
              {activity.quantity && <span className="text-muted-foreground"> ({activity.quantity} unidades)</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

