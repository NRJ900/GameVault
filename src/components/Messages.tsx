import { ArrowLeft, Bell, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    type: "achievement" | "system" | "info";
}

interface MessagesProps {
    notifications: Notification[];
    onBack: () => void;
    onMarkAsRead: (id: string) => void;
    onClearAll: () => void;
}

export function Messages({ notifications, onBack, onMarkAsRead, onClearAll }: MessagesProps) {
    const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="size-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1>Messages</h1>
                                    <p className="text-muted-foreground">Your notifications and alerts</p>
                                </div>
                            </div>

                            {notifications.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={onClearAll}
                                    className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {sortedNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Bell className="w-16 h-16 mb-4 text-muted-foreground" />
                        <p className="text-lg">No new messages</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedNotifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={`p-4 border transition-all ${notification.read ? "bg-card/30 opacity-70" : "bg-card border-[var(--gaming-accent)]/30"
                                        }`}
                                    onClick={() => onMarkAsRead(notification.id)}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? "bg-transparent" : "bg-[var(--gaming-accent)]"
                                            }`} />

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
