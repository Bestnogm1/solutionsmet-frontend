
import { useState } from "react"
import { Button } from "../../../@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../../../@/components/ui/dialog"
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"


export const TicketDetailComp = ({ ticketDetail }: any) => {
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8000/task/delete-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskId: ticketDetail._id,
          status: ticketDetail.status,
          projectId: "653e677c1df38bd7c5421ec9"
        })
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["project"] as InvalidateQueryFilters)
      toast("ticket deleted successfully")
      setCreateTicketModalOpen(false);
    }
  })
  const deleteTicket = async () => {
    await mutateAsync()
  }
  return (
    <Dialog
      open={createTicketModalOpen}
      // @ts-ignore
      defaultOpen={() => createTicketModalOpen}
      onOpenChange={setCreateTicketModalOpen}

    >
      <DialogTrigger asChild>
        <div>
          <div>
            <h2 className="font-semibold text-lg mb-2">
              {ticketDetail.ticketTitle}
            </h2>
            <p className="text-gray-700">
              {ticketDetail.description}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="  flex gap-5 w-full  flex-col g">
          <div>
            <h2 className="font-semibold text-lg mb-2">
              {ticketDetail.ticketTitle}
            </h2>
            <p className="text-gray-700">
              {ticketDetail.description}
            </p>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={deleteTicket}>
            Delete Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
// className = "resize-none"
