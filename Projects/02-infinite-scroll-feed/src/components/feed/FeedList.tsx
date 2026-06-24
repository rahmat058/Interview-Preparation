import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { loadInitialFeed, loadMoreFeed } from "@/lib/store/slices/feedSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSeenPostIds } from "@/hooks/useSeenPostIds";
import { FeedCard } from "./FeedCard";
import { FeedError } from "./FeedError";
import { FeedLoadMore } from "./FeedLoadMore";
import { FeedSkeletonList } from "./FeedSkeleton";

export function FeedList() {
  const dispatch = useAppDispatch();
  const { posts, status, error, meta } = useAppSelector((state) => state.feed);
  const { markSeen } = useSeenPostIds();

  const hasMore = meta?.hasMore ?? false;
  const isInitialLoading = status === "loading" || status === "idle";
  const isLoadingMore = status === "loadingMore";
  const isLoading = isInitialLoading || isLoadingMore;
  const isFailed = status === "failed";

  useEffect(() => {
    const promise = dispatch(loadInitialFeed());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    dispatch(loadMoreFeed());
  }, [dispatch, hasMore, isLoading]);

  const handleRetry = useCallback(() => {
    if (posts.length === 0) {
      dispatch(loadInitialFeed());
    } else {
      dispatch(loadMoreFeed());
    }
  }, [dispatch, posts.length]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading,
  });

  if (isInitialLoading) {
    return <FeedSkeletonList count={4} />;
  }

  if (isFailed && posts.length === 0) {
    return (
      <FeedError
        message={error ?? "Failed to load feed"}
        onRetry={handleRetry}
        isRetrying={isLoading}
      />
    );
  }

  let newStagger = 0;

  return (
    <div className="feed-scroll-anchor space-y-4">
      {posts.map((post) => {
        const isNew = markSeen(post.id);
        const staggerIndex = isNew ? newStagger++ : 0;
        return (
          <FeedCard
            key={post.id}
            post={post}
            isNew={isNew}
            staggerIndex={staggerIndex}
          />
        );
      })}

      {isFailed && posts.length > 0 && (
        <FeedError
          message={error ?? "Failed to load more"}
          onRetry={handleRetry}
          isRetrying={isLoadingMore}
        />
      )}

      <div className="flex min-h-18 flex-col justify-center">
        <div ref={sentinelRef} className="h-px w-full" aria-hidden />
        <FeedLoadMore isLoading={isLoadingMore} hasMore={hasMore} />
      </div>
    </div>
  );
}
