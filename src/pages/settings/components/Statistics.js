import * as React from 'react'

class Statistics extends React.Component {
		constructor (props) {
				super(props)
				this.fb = this.props.fireBase
				this.state = {
						allStatDocs: [],
				}
		}

		getStatsDocs = async () => {
				const collections = await this.fb
					.firebase
					.firestore()
					.collection('Statistics')
				return await collections.get().then((snapshot) => {
						const tMap = snapshot.docs.map(doc => {
								return {
										id: doc.id,
										data: doc.data(),
								}
						})
						this.setState((state) => {
								state.allStatDocs = tMap
								return state
						})
						return tMap.length
				})
		}

		componentDidMount = () => {
				this.getStatsDocs().then(r => console.log(this.state.allStatDocs))
		}

		render () {
				return (
					<>
							<pre>ToDo: Use Chart.js for nice stats</pre>
							<ul>
									{this.state.allStatDocs.map((item, i) => {
											return (
												<li>Datum: {item.id}
														<ul>
																<li>Nutzer: {item.data.userAmount}</li>
																<li>Klassen: {item.data.classAmount}</li>
														</ul>
												</li>
											)
									})}
							</ul>
					</>
				)
		}
}

export default Statistics
