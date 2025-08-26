package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.Message;
import com.ashutosh0640.inventy.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp")
    List<Message> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    List<Message> findByGroupOrderByTimestamp(Group group);

    List<Message> findByReceiverAndIsReadFalse(User receiver);

    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user")
    List<User> findUsersWhoMessagedUser(@Param("user") User user);


    /**
     * Finds messages with a timestamp before the given one, ordered by timestamp descending.
     *
     * @param timestamp The cursor timestamp.
     * @param pageable  The pagination information (limit and sort order).
     * @return A list of messages.
     */
    List<Message> findByTimestampBefore(LocalDateTime timestamp, Pageable pageable);

    /**
     * Finds messages with a timestamp after the given one, ordered by timestamp ascending.
     *
     * @param timestamp The cursor timestamp.
     * @param pageable  The pagination information (limit and sort order).
     * @return A list of messages.
     */
    List<Message> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);
}
