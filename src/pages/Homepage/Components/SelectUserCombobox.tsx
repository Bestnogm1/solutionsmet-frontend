
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../@/components/ui/select"
export const SelectTaskStatus = ({ setSelectStatusChange }: any) => {
  return (
    <Select onValueChange={(value) => setSelectStatusChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="backlog">Backlog</SelectItem>
          <SelectItem value="inProgress">In Progress</SelectItem>
          <SelectItem value="readyForReview">Ready For Review</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
export const SelectUserCombobox = ({ projectData, setSelectUserChange }: any) => {
  return (
    <Select onValueChange={(value) => setSelectUserChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an assignee" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {projectData?.members?.map((user: any) => (
            <SelectItem value={user._id}>{user.firstName}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
export const SelectSeverity = ({ setSelectSeverityChange }: any) => {
  const severity = ["Low", "Medium", "High"]
  return (
    <Select onValueChange={(value) => setSelectSeverityChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an severity" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {severity?.map((ser: any) => (
            <SelectItem value={ser}>{ser}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
