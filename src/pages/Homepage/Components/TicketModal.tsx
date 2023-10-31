import { useState } from "react"
import { Button } from "../../../@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../../../@/components/ui/dialog"
import { Input } from "../../../@/components/ui/input"
import { Label } from "../../../@/components/ui/label"
import { Textarea } from "../../../@/components/ui/textarea"
import { SelectSeverity, SelectTaskStatus, SelectUserCombobox } from "./SelectUserCombobox"
import { toast } from "react-toastify"
import { useQuery, QueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const CreateTicketModal = ({ projectData }: any) => {
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false)
  const [selectUserChange, setSelectUserChange] = useState("")
  const [selectStatusChange, setSelectStatusChange] = useState("")
  const [selectSeverityChange, setSelectSeverityChange] = useState("")
  const [taskInput, setTaskInput] = useState<any>({
    ticketTitle: "",
    description: "",
    assignedTo: "",
    severity: "",
    status: "",
    projectId: "653e677c1df38bd7c5421ec9"
  })

  const queryClient = useQueryClient()
  const { mutateAsync, isError, status, data } = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8000/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...taskInput,
          assignedTo: selectUserChange,
          severity: selectSeverityChange,
          status: selectStatusChange
        })
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["project"] as InvalidateQueryFilters)
    }
  })

  const handleCreateTicket = async () => {
    console.log({
      ...taskInput,
      assignedTo: selectUserChange,
      severity: selectSeverityChange,
      status: selectStatusChange
    })
    await mutateAsync()
    if (isError) {
      toast("Something went wrong")
      return
    }
    toast("Ticket created successfully");
    setCreateTicketModalOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setTaskInput({
      ...taskInput,
      [name]: value,
      assignedTo: selectUserChange,
      severity: selectSeverityChange,
      status: selectStatusChange
    })
  }


  return (
    <Dialog
      open={createTicketModalOpen}
      // @ts-ignore
      defaultOpen={() => createTicketModalOpen}
      onOpenChange={setCreateTicketModalOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white py-2 px-4 rounded-full mb-4 w-full"
          onClick={() => setCreateTicketModalOpen(true)}>
          Create a ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="  flex gap-5 w-full  flex-col g">
          <div className="flex w-full  gap-5 ">
            <div className="w-full flex flex-col gap-5">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="Ticket Title"> Title</Label>
                <Input type="text" id="text" placeholder="Ticket Title" onChange={handleInputChange} name="ticketTitle" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Assignee</Label>
                <SelectUserCombobox projectData={projectData} setSelectUserChange={setSelectUserChange} />
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="Severity">Severity</Label>
                <SelectSeverity setSelectSeverityChange={setSelectSeverityChange} />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="status">status</Label>
                <SelectTaskStatus setSelectStatusChange={setSelectStatusChange} />
              </div>
            </div>
          </div>
          <div className="w-full ">
            <div>
              <div className="grid w-full  items-center gap-1.5">
                <Label htmlFor="email">description</Label>
                <Textarea placeholder="Type your message here." className="resize-none h-40" onChange={handleInputChange} name="description" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={handleCreateTicket}>
            Create a ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
// className = "resize-none"
