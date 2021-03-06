import * as React from 'react';
import './Search.css';

import { Tabbar } from './Tabbar'
import { ListItem } from './ListItem'
import { Button } from './Button'
import { AudioBeat } from './AudioBeat'

import { search, Song, setMusicState } from './QQMusicAPI'

import { like, dic } from './gobal'

const S = {
    textSearch: '',
    listSearch: [] as Song[],
    isPlaying: true,
    nowPlayID: -1, //当前播放的歌曲id
    collectIDs: [] as number[],//收藏的歌曲id 数组
    nowPlayImgURL: ''
}

export class Search extends React.Component<{ myMusic: () => void, search: () => void }, typeof S>{

    change(text: string) {
        this.setState({
            textSearch: text
        })

        dic.textSearch = text

        search(text, list => {
            this.setState({ listSearch: list })
            dic.searchList = list
        })


    }

    play(song: Song) {
        this.setState({
            nowPlayID: song.songid,
            isPlaying: song.songid == this.state.nowPlayID && this.state.isPlaying ? false : true
        }, () => {
            setMusicState({ songid: song.songid, playing: this.state.isPlaying })
            dic.nowPlayID = song.songid
            dic.nowPlayImgURL = song.albumImageURL
        })


    }

    collect(song: Song) {
        if (this.getCollect(song)) {
            //取消收藏
            this.setState({
                collectIDs: this.state.collectIDs.filter(id => id != song.songid)
            })
        } else {
            //收藏
            this.setState({
                collectIDs: [...this.state.collectIDs, song.songid]
            })
            like(song)
        }
    }
    isPlaying(song: Song) {
        return this.state.nowPlayID == song.songid && this.state.isPlaying
    }
    componentWillMount() {
        this.setState({
            ...S,
            textSearch: dic.textSearch,
            listSearch: dic.searchList,
            collectIDs: dic.myCollect.map(v => v.songid),
            nowPlayID: dic.nowPlayID,
            isPlaying: dic.isPlaying,
            nowPlayImgURL : dic.nowPlayImgURL
        })
        this.change(dic.textSearch)
    }

    getCollect(song: Song) {
        return this.state.collectIDs.find(id => song.songid == id) != null
    }

    render() {
        return <div className='search'>
            <div className='searchTop'>
                <Tabbar
                    changPage1={() => this.props.search()}
                    changPage2={() => this.props.myMusic()}
                    backgroundColor1='rgba(255, 192, 204, 0.7)'
                    backgroundColor2='rgba(255, 192, 204, 0)' />
                <div className='searchTopBox'>
                    <AudioBeat />
                    <div className='searchInputBox'>
                        <input
                            className='searchTopInput'
                            placeholder='请输入搜索内容'
                            type="text" value={this.state.textSearch}
                            onChange={v => this.change(v.target.value)} />
                    </div>
                </div>
            </div>
            <div className='searchList'>
                {this.state.listSearch.map((v, index) =>
                    <ListItem
                        img={v.albumImageURL}
                        songName={v.songname}
                        singer={v.singerName}
                        onClickPlay={() => this.play(v)}
                        isPlay={this.isPlaying(v)}
                        onClickCollect={() => this.collect(v)}
                        isCollect={this.getCollect(v)}
                    />
                )}
            </div>
        </div>
    }
}