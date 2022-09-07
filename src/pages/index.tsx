/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next'
import { api } from '../services/api'
import Image from 'next/image'
import Head from 'next/head'
import React from 'react'

import Link from 'next/link'

import { ConvertDurationToTimeString } from '../utils/ConvertDurationToTimeString'

import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'

 type Episode = {
  id: string
  title: string
  members: string
  thumbnail: string
  description: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
}

  type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}


export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList, isPlaying, currentEpisodeIndex } = usePlayer()
  const [episodeActive, setEpisodeActive] = React.useState(true)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li
                key={episode.id}
                className={
                  isPlaying && currentEpisodeIndex === index ? styles.activePlay : ''
                }
              >
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr
                  key={episode.id}
                  className={
                    playList && isPlaying && currentEpisodeIndex === index + 2
                      ? styles.activePlay
                      : ''
                  }
                >
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img
                        src="/play-green.svg"
                        alt="Tocar episódio"
                        onClick={() =>
                          playList(episodeList, index + latestEpisodes.length)
                        }
                      />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const data = response.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: new Date(episode.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      duration: Number(episode.file.duration),
      durationAsString: ConvertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}
