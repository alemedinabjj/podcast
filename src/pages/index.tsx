
export default function Home(props) {

  console.log(props.episodes)

  return (
    <>
      <h1>index</h1>
    </>
  )
}

export const getStaticProps = async () => {
  const response = await fetch("http://localhost:3333/episodes")
  const data = await response.json()


  return {
    props: {
      episodes: data,
    },
    revalidade: 60 * 60 * 8,
  }
}