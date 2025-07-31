import { Box } from "grommet"
import Clock from "../Clock";

function Home() {
  return (
    <>
      <Box pad="medium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Clock />
      </Box>
    </>
  )
}

export default Home;