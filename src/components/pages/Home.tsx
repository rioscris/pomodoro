import { Box } from "grommet"
import Pomodoro from "../Pomodoro";

function Home() {
  return (
    <>
      <Box pad="medium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Pomodoro />
      </Box>
    </>
  )
}

export default Home;