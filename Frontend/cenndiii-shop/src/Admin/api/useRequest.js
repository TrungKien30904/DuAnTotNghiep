import { useEffect, useState, useCallback } from 'react'
import useUSer from '@store/useUser'
import axios from 'axios'
import useHandleError from './useHandleError'
import { isFunction } from '@utils/checkType'
import useTranslate from '@lang'
import { message as antdMessage } from 'antd'
import { PROTOCOL, HOST, PORT } from '@configs/app.config'

const useRequest = (prefixPath = '') => {
	const t = useTranslate()
	const { token } = useUSer()
	const handleError = useHandleError()
	const [controller, setController] = useState(new AbortController())

	const createRequest = () => axios.create({
		baseURL: `${PROTOCOL}://${HOST}:${PORT}/api/${prefixPath}`, // run on local
		timeout: 8000,
		headers: {
			Accept: 'application/json; charset=utf-8',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		signal: controller.signal
	})
	const [request, setRequest] = useState(() => createRequest())
	const createGetRequest = useCallback(({ endpoint, params, query, headers, successCallback }) => {

		console.log(endpoint, params);
		return (
			request
				.get(endpoint, { params, headers })
				.then(res => {
					if(isFunction(successCallback)) successCallback()
					return {
						success: true,
						data: res.data
					}
				})
				.catch(err => {
					const data = handleError(err)
					return {
						success: false,
						data
					}
				})
				.finally(() => {})
		)
	}, [request, t])

	const createPostRequest = useCallback(({ endpoint, data, headers, ...props }) => {
		console.log(endpoint, data);
		try {
			return (
				request
					.post(endpoint, data, {headers: headers} , { ...props })
					.then(res => {
						const { data } = res
						const { message } = data
						return {
							success: true,
							data
						}
					})
					.catch(err => {
						const data = handleError(err)
						console.log(data)
						return {
							success: false,
							data
						}
					})
					.finally(() => {})
			)
		} catch (error) {
			console.log(error);
			alert(error.message)
		}

	}, [request, t])




	const createPutRequest = useCallback(({ endpoint, data, params, ...props }) => {
		return (
			request
				.put(endpoint, data, {params: params} , { ...props })
				.then(res => {
					const { data } = res
					return {
						success: true,
						data
					}
				})
				.catch(err => {
					const data = handleError(err)
					return {
						success: false,
						data
					}
				})
				.finally(() => {})
		)
	}, [request, t])




	const createDeleteRequest = useCallback(({ endpoint, params, headers }) => {
		return (
			request
				.delete(endpoint, {params})
				.then(res => {
					console.log(res);
					const { data } = res
					console.log(res);
					const { message } = data
					return {
						success: true,
						data
					}
				})
				.catch(err => {
					const data = handleError(err)
					console.log(data)
					return {
						success: false,
						data
					}
				})
				.finally(() => {})
		)
	}, [request, t])

	const cancel = () => {
		controller.abort()
		setController(new AbortController())
	}

	useEffect(() => {
		setRequest(() => createRequest())
	}, [controller])

	return {
		request,
		createGetRequest,
		createPostRequest,
		createPutRequest,
		createDeleteRequest,
		cancel
	}
}

export default useRequest