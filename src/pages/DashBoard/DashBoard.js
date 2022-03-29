import { Alert, ButtonBase, Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, TextField } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { activity_api, general_api, login_api, location_api, qrcode_api, photo_api } from '../../config/api'
import './DashBoard.css'

function DashBoard(props) {
  const params = useParams()
  const [userParams, setUserParams] = useState()
  const [sign, setSign] = useState({
    activity: {
      name: ''
    },
    status: ''
  })
  const [values, setValues] = useState({})
  const [indb, setIndb] = useState()
  const [alert, setAlert] = useState({ msg: '', show: false, severity: 'info' })

  const [control, setControl] = useState({
    start: {
      show: true
    }
  })

  const start = async () => {
    document.getElementById('start-btn').classList.add('hidden')
    setTimeout(() => {
      setControl({ start: { show: false } })
    }, 500)
    let activity = await axios.post(activity_api, {
      uf: userParams.uf,
      _d: userParams._d,
      vc3: userParams.vc3,
      uid: userParams._uid
    })
    console.log(activity.data)
    if (activity.data === 'NoActivity') {
      setSign({ activity: { name: '无签到活动' } })
    } else {
      setSign({ activity: activity.data })
    }
    switch (activity.data.otherId) {
      case 2: {
        // 二维码签到
      }
      case 4: {
        // 位置签到
      }
      case 3: {
        // 手势签到
      }
      case 5: {
        // 签到码签到
      }
      case 0: {
        // 拍照签到
        // 普通签到
      }
    }
  }

  const generalSign = async () => {
    let result = await axios.post(general_api, {
      uf: userParams.uf,
      _d: userParams._d,
      vc3: userParams.vc3,
      uid: userParams._uid,
      fid: userParams.fid,
      aid: sign.activity.aid,
      name: userParams.name
    })
    return result.data
  }
  const photoSign = async () => {
    let result = await axios.post(photo_api, {
      uf: userParams.uf,
      _d: userParams._d,
      vc3: userParams.vc3,
      uid: userParams._uid,
      fid: userParams.fid,
      aid: sign.activity.aid,
      name: userParams.name
    })
    return result.data
  }
  const qrcodeSign = async (enc) => {
    let result = await axios.post(qrcode_api, {
      uf: userParams.uf,
      _d: userParams._d,
      vc3: userParams.vc3,
      uid: userParams._uid,
      fid: userParams.fid,
      aid: sign.activity.aid,
      name: userParams.name,
      enc: enc
    })
    return result.data
  }
  const locationSign = async (lat, lon, address) => {
    let result = await axios.post(location_api, {
      uf: userParams.uf,
      _d: userParams._d,
      vc3: userParams.vc3,
      uid: userParams._uid,
      fid: userParams.fid,
      aid: sign.activity.aid,
      name: userParams.name,
      lat: lat,
      lon: lon,
      address: address
    })
    return result.data
  }

  const handleRadio = (type) => {
    let label_general = document.getElementById('label-general')
    let label_photo = document.getElementById('label-photo')
    switch (type) {
      case 'general': {
        label_general.className = 'checked'
        label_photo.className = 'unchecked'
        break
      }
      case 'photo': {
        label_general.className = 'unchecked'
        label_photo.className = 'checked'
        setAlert({ msg: '确保已将照片上传指定位置，点击签到', severity: 'info', show: true })
      }
    }
  }
  const updateValue = (name, value) => {
    setValues((prev) => {
      let object = { ...prev }
      object[name] = value
      return object
    })
  }
  const setStatus = (res) => {
    if (res === 'success') {
      setSign((prev) => {
        return {
          activity: prev.activity,
          status: '签到成功'
        }
      })
    } else {
      setSign((prev) => {
        return {
          activity: prev.activity,
          status: res
        }
      })
    }
  }
  const onSign_0 = async () => {
    let res
    if (document.getElementById('general').checked) {
      res = await generalSign()
      setStatus(res)
    } else {
      res = await photoSign()
      setStatus(res)
    }
    document.getElementById('sign-btn').disabled = 'disabled'
    let neum_form = document.getElementsByClassName('neum-form')[0]
    let content = document.getElementById('neum-form-content')
    content.style.opacity = 0
    setTimeout(() => {
      content.style.display = 'none'
      neum_form.classList.add('form-height')
    }, 600)
  }
  const onSign_2 = async () => {
    let res = await qrcodeSign(values['enc'])
    setStatus(res)
    document.getElementById('sign-btn').disabled = 'disabled'
    let neum_form = document.getElementsByClassName('neum-form')[0]
    let content = document.getElementById('neum-form-content')
    content.style.opacity = 0
    setTimeout(() => {
      content.style.display = 'none'
      neum_form.classList.add('form-height')
    }, 600)
  }
  const onSign_4 = async () => {
    let res = await locationSign(
      Number(values['latlon'].substring(values['latlon'].indexOf(',') + 1, values['latlon'].length)),
      Number(values['latlon'].substring(0, values['latlon'].indexOf(','))),
      values['address'])
    setStatus(res)
    document.getElementById('sign-btn').disabled = 'disabled'
    let neum_form = document.getElementsByClassName('neum-form')[0]
    let content = document.getElementById('neum-form-content')
    content.style.opacity = 0
    setTimeout(() => {
      content.style.display = 'none'
      neum_form.classList.add('form-height')
    }, 600)
  }
  const onSign_35 = async () => {
    let res = await generalSign()
    setStatus(res)
    document.getElementById('sign-btn').disabled = 'disabled'
    let neum_form = document.getElementsByClassName('neum-form')[0]
    let content = document.getElementById('neum-form-content')
    content.style.opacity = 0
    setTimeout(() => {
      content.style.display = 'none'
      neum_form.classList.add('form-height')
    }, 600)
  }

  useEffect(() => {
    let request = indexedDB.open('ui')
    request.onsuccess = () => {
      // 判断登录时间，进行重新认证
      let db = request.result.transaction('user', 'readwrite').objectStore('user')
      setIndb(db)
      // 获取用户登录时间
      db.get(params.phone).onsuccess = async (event) => {
        setUserParams(event.target.result)
        // 身份过期自动重新登陆
        if (Date.now() - event.target.result.date > 432000000) {
          let res = await axios.post(login_api, {
            phone: event.target.result.phone,
            password: event.target.result.password
          })
          if (res.data === 'AuthFailed') {
            setAlert({ msg: '重新登录失败', show: true, severity: 'error' })
          } else {
            setUserParams(event.target.result)
            // 登陆成功将新信息写入数据库
            db.put({
              phone: event.target.result.phone,
              fid: res.data.fid,
              vc3: res.data.vc3,
              password: event.target.result.password,
              _uid: res.data._uid,
              _d: res.data._d,
              uf: res.data.uf,
              name: res.data.name,
              date: new Date()
            }).onsuccess = () => {
              setAlert({ msg: '凭证已自动更新', show: true, severity: 'success' })
            }
          }
        }
      }
    }
  }, [])

  return (
    <div>
      {
        control.start.show &&
        <ButtonBase
          id='start-btn'
          onClick={start}
          sx={{ borderRadius: 50 }}
          className='neum-button'
          disableRipple
        >
          <span>开始</span>
        </ButtonBase>
      }
      <h1>{sign.activity.name}</h1>
      {
        sign.activity.otherId === 0 &&
        <Box
          component='div'
          id='neum-form'
          className='neum-form'
        >
          <h3>{sign.status}</h3>
          <div id='neum-form-content' className='form-content'>
            <p className='form-title'>勾选签到方式</p><br />
            <label id='label-general' onClick={() => { handleRadio('general') }} className='checked' htmlFor='general' style={{ fontSize: '1.6rem' }}>
              <input hidden defaultChecked type='radio' name='sign' id='general' value='general' />
              &nbsp;普通
            </label>&emsp;
            <label id='label-photo' onClick={() => { handleRadio('photo') }} className='unchecked' htmlFor='photo' style={{ fontSize: '1.6rem' }}>
              <input hidden type='radio' name='sign' id='photo' value='photo' />
              &nbsp;拍照
            </label>
            <br />
            <ButtonBase
              id='sign-btn'
              onClick={onSign_0}
              className='neum-form-button'
              disableRipple
            >签到</ButtonBase>
          </div>
        </Box>
      }
      {
        sign.activity.otherId === 2 &&
        <Box
          component='div'
          id='neum-form'
          className='neum-form'
        >
          <h3>{sign.status}</h3>
          <div id='neum-form-content' className='form-content'>
            <p className='form-title'>填写enc参数</p><br />
            <input id='input-enc' className='input-area' type='text' onChange={(e) => {
              updateValue('enc', e.target.value)
            }} />
            <br />
            <ButtonBase
              id='sign-btn'
              onClick={onSign_2}
              className='neum-form-button'
              disableRipple
            >签到</ButtonBase>
          </div>
        </Box>
      }
      {
        sign.activity.otherId === 4 &&
        <Box
          component='div'
          id='neum-form'
          className='neum-form'
        >
          <h3>{sign.status}</h3>
          <div id='neum-form-content' className='form-content'>
            <p className='form-title'>经纬度和地址</p><br />
            <input id='input-latlon' className='input-area' placeholder='例: 116.417492,39.920912' type='text'
              onChange={(e) => {
                updateValue('latlon', e.target.value)
                console.log(values)
              }} />
            <input id='input-address' className='input-area' placeholder='如: 河南省郑州市x区x大学' type='text'
              onChange={(e) => {
                updateValue('address', e.target.value)
                console.log(values)
              }} />
            <br />
            <ButtonBase
              id='sign-btn'
              onClick={onSign_4}
              className='neum-form-button'
              disableRipple
            >签到</ButtonBase>
          </div>
        </Box>
      }
      {
        (sign.activity.otherId === 3 || sign.activity.otherId === 5) &&
        <Box
          component='div'
          id='neum-form'
          className='neum-form'
        >
          <h3>{sign.status}</h3>
          <div id='neum-form-content' className='form-content'>
            <p className='form-title'>点击签到</p>
            <br />
            <ButtonBase
              id='sign-btn'
              onClick={onSign_35}
              className='neum-form-button'
              disableRipple
            >签到</ButtonBase>
          </div>
        </Box>
      }

      <Snackbar
        open={alert.show}
        autoHideDuration={3000}
        onClose={() => { setAlert({ show: false }) }}
      >
        <Alert onClose={() => { setAlert({ show: false }) }} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.msg}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default DashBoard