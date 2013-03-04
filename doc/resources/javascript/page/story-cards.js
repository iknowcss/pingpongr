(function ($) {
    var storyCardMap = {},
        storyCardShowing;

    function init() {
        $(window).bind("hashchange", handleHashChange);

        loadStoryCards(".story-card[data-story-card]");
        handleHashChange();
    }

    function handleHashChange() {
        activateStoryCard(getPageHash());
    }

    function getPageHash() {
        return document.location.hash.substring(1);
    }

    function activateStoryCard(cardNumber) {
        var storyCard = storyCardMap[cardNumber];

        hideActiveStoryCard()
        if (storyCard) {
            storyCard.show();
            storyCardShowing = storyCard;
        }
    }

    function hideActiveStoryCard() {
        if (storyCardShowing instanceof $) {
            storyCardShowing.hide();
        }
        storyCardShowing = undefined;
    }

    function loadStoryCards(storyCards) {
        $(storyCards).map(function() {
            var $this = $(this),
                cardNumber = $this.data("story-card");
            storyCardMap[cardNumber] = $this;
        });
    }

    $(init);
}(jQuery));