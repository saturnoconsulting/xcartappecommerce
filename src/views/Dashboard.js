import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  useWindowDimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ProductsHome from '../components/ProductsHome';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchPosts from '../hooks/useFetchPosts';
import useCategories from '../hooks/useCategories';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useCart from '../hooks/useCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCartLength } from '../store/actions/cartActions';
import { useDispatch } from 'react-redux';
import { backgroundcolor, primaryColor } from '../constants/colors';
import NewsHome from '../components/NewsHome';
import ManualCarousel from '../components/Carousel';
import DashboardHeader from '../components/DashboardHeader';
import CustomText from '../components/atoms/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
// Import condizionali tramite widgetLoader per escludere componenti non utilizzati dal bundle
import { getWidgetComponent, isWidgetActive, xEventsWidget, activityType } from '../utils/widgetLoader';
import { getSubActive } from '../api/subs';
import { appMode, enableEcommerce } from '../utils/brandConstants';
import useFetchBadges from '../hooks/useFetchBadges';


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isDomoticaMode = appMode === 'domotica';
  const { badges, loading: badgesLoading } = useFetchBadges({});

  const [listPosts, setListPosts] = useState([]);
  const [sliderPosts, setSliderPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [storedCartId, setStoredCartId] = useState(null);
  const [shouldFetchCart, setShouldFetchCart] = useState(false);
  const [subActive, setSubActive] = useState(false);

  const { prods, refreshProducts } = useFetchProducts({
    ids: null,
    params: {
    },
  });

  const { posts, refreshPosts,
    loading: loadingPosts,
    loadMorePosts,
    isFetchingMore,
    canLoadMore, } = useFetchPosts({ params: { types: ["list", "slider"] } });

  const { cats, loading: loadingCategories, refreshCategories } = useCategories();

  const { height, width } = useWindowDimensions();

  //quando il componente viene montato, recupera l'id del carrello salvato in AsyncStorage
  useEffect(() => {
    const getCartId = async () => {
      const id = await AsyncStorage.getItem('cartId');
      //console.log('Cart ID from AsyncStorage:', id);
      if (id && id !== 'null' && id !== '') {
        setStoredCartId(id);
        setShouldFetchCart(true);
      }
    };
    getCartId();
  }, []);

  const { cartData, refetch, loading: cartLoading } = useCart({
    idcart: shouldFetchCart ? storedCartId : null,
  });

  //gestisci il recupero del carrello quando l'id viene effettivamente caricato dall'async 
  useEffect(() => {
    if (shouldFetchCart && refetch) {
      refetch();
    }
  }, [shouldFetchCart, storedCartId]);

  //setta la la lunghezza del carrello per gestire il badge dell'icona carrello
  useEffect(() => {
    if (cartData?.lineItems) {
      dispatch(setCartLength(cartData.lineItems.length));
    }
  }, [cartData]);


  useEffect(() => {
    refreshPosts();
    refreshProducts();
    refreshCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchActive = async () => {
        let active = await getSubActive();
        setSubActive(active);
      };
      if(xEventsWidget) {
        fetchActive();
      }
    }, [])
  );


  // carica contenuti del CMS per slider e post/news
  useEffect(() => {
    if (Array.isArray(posts)) {
      const list = [];
      const slider = [];
      posts.forEach(post => {
        if (post.type === 'list') list.push(post);
        else if (post.type === 'slider') slider.push(post);
      });
      setListPosts(list);
      setSliderPosts(slider);
    }
  }, [posts]);


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProducts();
      await refreshPosts();
      await refreshCategories();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSlidePress = (post) => {
    navigation.navigate('PostsDetails', { post });
  };

  const handleBadgePress = () => {
    // Dai badge aperti dalla Home vogliamo restare nello stack Home
    // così il tab attivo rimane Home e la freccia indietro torna alla Dashboard
    navigation.navigate('Home', { screen: 'Badges' });
  };

  const renderBadgeCard = () => {
    if (!isDomoticaMode) return null;

    const activeBadges = badges?.filter(badge => {
      if (!badge.revoked_at) return true;
      const revoked = new Date(badge.revoked_at);
      return revoked > new Date();
    }) || [];

    return (
      <TouchableOpacity
        style={styles.badgeCard}
        onPress={handleBadgePress}
        activeOpacity={0.7}
      >
        <View style={styles.badgeCardContent}>
          <View style={styles.badgeCardLeft}>
            <Icon name="card-outline" size={32} color={primaryColor} />
            <View style={styles.badgeCardText}>
              <CustomText style={styles.badgeCardTitle}>I tuoi Badge</CustomText>
              <CustomText style={styles.badgeCardSubtitle}>
                {activeBadges.length > 0 
                  ? `${activeBadges.length} badge attiv${activeBadges.length === 1 ? 'o' : 'i'}`
                  : 'Nessun badge attivo'}
              </CustomText>
            </View>
          </View>
          <Icon name="chevron-forward" size={24} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    const isFood = activityType === 'food';
    const isXEventsWidget = xEventsWidget;

    // Carica i componenti widget solo se attivi (lazy loading)
    const FoodCategoriesSection = getWidgetComponent('FoodCategoriesSection');
    const CategoriesBox = getWidgetComponent('CategoriesBox');
    const BoxMatches = getWidgetComponent('BoxMatches');

    return (
      <View style={{ flex: 1, maxWidth: width }}>
      
        {isFood || appMode !== 'standard' ? (
          <></>
        ) : (<>
          {sliderPosts.length > 0 && (
            <ManualCarousel
              data={sliderPosts}
              screenWidth={width}
              onSlidePress={handleSlidePress}
            />
          )}
        </>
        )}

        {isFood || !enableEcommerce? (
          FoodCategoriesSection && <FoodCategoriesSection />
        ) : (
          CategoriesBox && <CategoriesBox categories={cats} loading={loadingCategories} />
        )}
        {isXEventsWidget && BoxMatches && (
         <BoxMatches subActive={subActive} />
        )}
        {/* Badge Card in modalità domotica */}
        {isDomoticaMode && renderBadgeCard()}

        {!isDomoticaMode && <ProductsHome products={prods} />}
        {!isDomoticaMode && (
          <NewsHome
            styleTitle={{ textAlign: "left", paddingHorizontal: 20, paddingVertical: 5 }}
            styleCards={{ marginHorizontal: 20 }}
            listPosts={listPosts}
            refreshing={loadingPosts}
            onRefresh={refreshPosts}
            onLoadMore={loadMorePosts}
            isFetchingMore={isFetchingMore} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <FlatList
        style={{ backgroundColor: backgroundcolor }}
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
  },
  badgeCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  badgeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgeCardText: {
    marginLeft: 16,
    flex: 1,
  },
  badgeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  badgeCardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default Dashboard;
