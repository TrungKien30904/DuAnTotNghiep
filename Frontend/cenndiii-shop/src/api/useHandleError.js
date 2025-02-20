import useTranslate from '@lang'
import { useNavigate } from 'react-router-dom'
import { message, notification } from 'antd'

import { HTTP_STATUS } from '@configs/app.config'

const {
	BAD_REQUEST,
	UNAUTHORIZED,
	NOT_FOUND,
	METHOD_NOT_ALLOWED,
	TOO_MANY_REQUEST,
	SERVER_ERROR,
} = HTTP_STATUS

const useHandleError = () => {
	const navigate = useNavigate()
	const t = useTranslate()
    
	const handleError = (error) => {
		const { response, request } = error
		if(response) {
			const { data, status } = response


			switch(status) {
			case BAD_REQUEST:
				message.warning(t(data.message).toUpperFirst())
				break
			case UNAUTHORIZED:
				notification.info({
					message: t('login session expired').toUpperFirst(),
					description: t('please login again').toUpperFirst(),
					placement: 'bottomRight'
				})
				navigate('/login')
				break
			case NOT_FOUND:
				message.error(t('url not found').toUpperFirst())
				break
			case METHOD_NOT_ALLOWED:
				message.error(t('method not allowed').toUpperFirst())
				break
			case TOO_MANY_REQUEST:
				message.error(t('too many request').toUpperFirst())
				break
			case SERVER_ERROR:
				notification.error({
					message: t('server error').toUpperFirst(),
					description: data.message,
					placement: 'bottomRight'
				})
				break
			default:
				message.error(`${t('error').toUpperFirst()}: ${status}`)
				break
			}

			return data

		} else if(request) {
			const { _hasError, _sent } = request

			console.log({request})
			if(_hasError) {
				if(_sent) {
					message.error(t('server not respond').toUpperFirst())
				} else {
					message.error(t('network error').toUpperFirst())
				}
			} else {
				message.error('request error unknown')
			
			}
		} else {
			// message.error('error unknown')
		}
	}

	return handleError
}

export default useHandleError