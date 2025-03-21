import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useToken = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(isAuthenticated);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        if (isMounted) {
          setToken(accessToken);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, isAuthenticated]);

  return { token, loading, error };
};

export default useToken;
