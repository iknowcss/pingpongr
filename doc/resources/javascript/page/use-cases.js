(function ($) {
    function init() {
        $("#use-cases li").each(linkifyStory);
    }

    function linkifyStory(index, storyItem) {
        var storyItem = $(storyItem),
            storyItemContents = storyItem.contents(),
            link = $("<a>");

        $(":before", storyItem);

        link.attr("href", "Story Cards.html#PPR-" + (index + 100))
            .text(storyItemContents.text());

        storyItemContents.replaceWith(link);
    }

    $(init);
}(jQuery));