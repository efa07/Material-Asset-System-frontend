"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Timeline } from "@/components/dashboard/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Wrench,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { mockAssets, mockMaintenanceTasks } from "@/lib/mock-data";

export default function TechnicianHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  const completedTasks = mockMaintenanceTasks.filter((m) => m.status === "COMPLETED");

  const filteredTasks = completedTasks.filter((task) => {
    const asset = mockAssets.find((a) => a.id === task.assetId);
    const matchesSearch =
      asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (monthFilter === "all") return matchesSearch;

    const taskDate = new Date(task.completedDate || task.scheduledDate);
    const filterDate = new Date(monthFilter);
    return (
      matchesSearch &&
      taskDate.getMonth() === filterDate.getMonth() &&
      taskDate.getFullYear() === filterDate.getFullYear()
    );
  });

  const totalCost = 0;

  const getAssetName = (assetId: string) => {
    const asset = mockAssets.find((a) => a.id === assetId);
    return asset?.name || "Unknown Asset";
  };

  const timelineItems = filteredTasks.slice(0, 10).map((task) => ({
    id: task.id,
    title: getAssetName(task.assetId),
    description: task.description,
    timestamp: new Date(task.scheduledDate).toISOString(),
    status: "success" as const,
    icon: <CheckCircle className="h-3 w-3" />,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Work History" description="View completed maintenance tasks (mock data)" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Wrench className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    0
                  </p>
                  <p className="text-sm text-muted-foreground">Emergency Repairs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-semibold">
                  Completed Tasks
                </CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-48"
                    />
                  </div>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="2024-01">January 2024</SelectItem>
                      <SelectItem value="2024-02">February 2024</SelectItem>
                      <SelectItem value="2024-03">March 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {getAssetName(task.assetId)}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-32">
                                {task.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{task.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(
                              task.completedDate || task.scheduledDate
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {"-"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
