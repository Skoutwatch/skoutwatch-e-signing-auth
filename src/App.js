import { DynamicContextProvider, DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import './index.css';

const App = () => {
	const sendParamsToBackend = async (params) => {
		const { primaryWallet, user } = params;
		const dataObject = {
			wallet_address: primaryWallet.address,
			dyanmicxyz_id: user.userId,
			email: user.email,
		};

		try {
			const response = await fetch(`${process.env.REACT_APP_API_LIVE}/user/login-dynamic`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataObject),
			});
			if (!response.ok) {
				throw new Error('Failed to send params to backend');
			}
			const responseData = await response.json();
			// Redirect to a different domain after backend resolves
			const newUrl = new URL('https://skoutwatch-e-signing.netlify.app');
			// Append token as a query parameter
			newUrl.searchParams.append('token', responseData.token);
			window.location.href = newUrl.toString();
		} catch (error) {
			console.error('Error sending params to backend:', error);
		}
	};

	return (
		<DynamicContextProvider
			settings={{
				environmentId: process.env.REACT_APP_DYNAMIC_ENVIRONMENT_LIVE_ID,
				debugError: true,
				eventsCallbacks: {
					onAuthSuccess: (params) => {
						sendParamsToBackend(params);
					},
				},
				walletConnectors: [SolanaWalletConnectors],
			}}
		>
			<DynamicWagmiConnector>
				<div className='container'>
					<div className='widget-container'>
						<DynamicEmbeddedWidget background='default' />
					</div>
				</div>
			</DynamicWagmiConnector>
		</DynamicContextProvider>
	);
};

export default App;

