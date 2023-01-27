import { FC, useState } from "react"
import { RootState, useAppSelector } from "../store/store"
import { Autocomplete, InputAdornment, TextField } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"


interface RecipientInputProps {
  value: string
  setValue: (value: string) => void
}

export const RecipientInput: FC<RecipientInputProps> = ({ value, setValue }) => {
  const users = useAppSelector((state: RootState) => state.app.users)
  const userNames = users.map(user => user.name)
  const [selectValue, setSelectValue] = useState<string | null>('')
  return (
    <Autocomplete
      disablePortal
      options={userNames}
      freeSolo
      value={selectValue}
      onChange={(_, newValue) => setSelectValue(newValue)}
      inputValue={value}
      onInputChange={(_, newInputValue) => setValue(newInputValue)}
      renderInput={params => {
        params.InputProps.startAdornment = (
          <InputAdornment position="start"> <PersonIcon className="text-orange-400"/> </InputAdornment>
        )
        return (
          <TextField {...params} variant="outlined" margin="normal" size="small" placeholder="To"/>
        )
      }}
      getOptionLabel={option => option}
    />

  )
}
