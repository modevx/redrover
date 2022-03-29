import React from "react";
import { Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "react-query";
// -----
import SafeAreaView from "./app/components/SafeAreaView";
import StackNavigator from "./app/navigation/stack-navigator";
import TabNavigator from "./app/navigation/top-tab-navigator";
import {
	fetchManifest,
	fetchLatestPhotos,
} from "./app/mars-photos-api/requests";
// -----
import { NAMES } from "./app/constants";
const queryClient = new QueryClient();

export default App = () => {
	const [appIsReady, setAppIsReady] = React.useState(false);

	const prefetchManifests = async () => {
		await queryClient.prefetchQuery(["manifest", NAMES.curiosity], () =>
			fetchManifest(NAMES.curiosity)
		);
		await queryClient.prefetchQuery(["manifest", NAMES.opportunity], () =>
			fetchManifest(NAMES.opportunity)
		);
		await queryClient.prefetchQuery(["manifest", NAMES.perseverance], () =>
			fetchManifest(NAMES.perseverance)
		);
		await queryClient.prefetchQuery(["manifest", NAMES.spirit], () =>
			fetchManifest(NAMES.spirit)
		);
	};
	const prefetchLatestPhotosForAllRovers = async () => {
		await queryClient.prefetchQuery(["latestPhotos", NAMES.curiosity], () =>
			fetchLatestPhotos(NAMES.curiosity)
		);
		await queryClient.prefetchQuery(["latestPhotos", NAMES.opportunity], () =>
			fetchLatestPhotos(NAMES.opportunity)
		);
		await queryClient.prefetchQuery(["latestPhotos", NAMES.perseverance], () =>
			fetchLatestPhotos(NAMES.perseverance)
		);
		await queryClient.prefetchQuery(["latestPhotos", NAMES.spirit], () =>
			fetchLatestPhotos(NAMES.spirit)
		);
	};

	React.useEffect(() => {
		const preFetchManifestsAndLatestPhotos = async () => {
			try {
				await SplashScreen.preventAutoHideAsync();
				// prefetch rover manifests & latest photos here
				prefetchManifests();
				prefetchLatestPhotosForAllRovers();
			} catch (err) {
				console.log("APP LOAD ERROR:\n", err);
			} finally {
				setAppIsReady(true);
			}
		};

		preFetchManifestsAndLatestPhotos();
	}, []);

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<SafeAreaView onLayout={onLayoutRootView}>
			<QueryClientProvider client={queryClient}>
				<NativeBaseProvider>
					{/* <ThemeProvider theme={RNE_THEME}> */}
					{/* <StackNavigator /> */}
					<TabNavigator />
					{/* </ThemeProvider> */}
				</NativeBaseProvider>
			</QueryClientProvider>
		</SafeAreaView>
	);
};
