import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { useEffect, useState } from 'react';

function ProfileSidebar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a target="_blank" className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title}({props.item.length})
      </h2>
      <ul>
        {props.item.map((itemAtual) => { 
          return (
            <li key={itemAtual.id} >
              <a href={`/communities/${itemAtual.id}`}>
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const [seguidores, setSeguidores] = useState([]);
  const [comunidades, setComunidades] = useState(['']);
  const usuarioAleatorio = 'ThalesTrombim';
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'diego3g'
  ]

  useEffect(() => {
    fetch('https://api.github.com/users/ThalesTrombim/followers')
    .then((res) => {
      return res.json();
    })
    .then((completeRes) => {
      console.log(completeRes);
      setSeguidores(completeRes);
    })


    //GraphQl
    fetch('https://graphql.datocms.com/', {
      method: 'POST', 
      headers: {
        'Authorization': '34ba2f33493c83bdd5619cc34f7694',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }` })
      })
      .then((res) => res.json())
      .then((CompleteRe) => {
        const comunidadesDato = CompleteRe.data.allCommunities;
        console.log(comunidadesDato);
        setComunidades(comunidadesDato);
      })

  }, [])
  

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet />

            <Box>
              <h2>O que você deseja fazer?</h2>
              <form action="" onSubmit={(e) => {
                e.preventDefault()
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image'),
                  creatorSlug: usuarioAleatorio
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                })

                // const comunidadadesAtualizadas = [...comunidades, comunidade]
                // setComunidades(comunidadadesAtualizadas)
              }}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                  />
                </div> 
                <div>
                  <input 
                    type="text" 
                    placeholder="Coloque uma URL para usar de capa"
                    name="image"
                    aria-label="Coloque uma URL para usar de capa"
                  />
                </div>

                <button type="submit">
                  Criar Comunidade
                </button>
              </form>
            </Box>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" item={seguidores} />

          <ProfileRelationsBox title="Comunidades" item={comunidades} />

          <ProfileRelationsBox title="Pessoas da Comunidade" item={pessoasFavoritas} />

          {/* <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper> */}

        </div>
      </MainGrid>
    </>
  )
}